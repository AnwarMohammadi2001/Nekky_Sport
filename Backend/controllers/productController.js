// controllers/productController.js

import {
  Product,
  ProductImage,
  ProductAttributeValue,
  Attribute,
} from "../models/index.js";
import sequelize from "../config/db.js";
import { Op } from "sequelize"; // Add this import
const normalizeAttributes = (attrs = []) => {
  return attrs.map((a) => {
    let value = a.value;

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        value = parsed;
      }
    } catch (e) {}

    return {
      ...a,
      value,
    };
  });
};

// Add this new search endpoint
export const searchProducts = async (req, res) => {
  try {
    const {
      q, // search query
      categoryId, // filter by category
      limit = 20, // results limit
      page = 1, // pagination
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    let whereClause = {};

    // Search in product name and description
    if (q && q.trim().length > 0) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
        ],
      };
    }

    // Filter by category
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    // Execute search with pagination
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ProductImage,
          limit: 1, // Get only first image for search results
          separate: false,
        },
        {
          model: ProductAttributeValue,
          include: [Attribute],
          limit: 3, // Get limited attributes for search results
          separate: false,
        },
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    // Normalize response to match your frontend expectations
    const normalizedProducts = products.map((product) => {
      const productJson = product.toJSON();

      // Get first image
      const mainImage = productJson.ProductImages?.[0];

      // Normalize attributes
      const normalizedAttributes = productJson.ProductAttributeValues?.map(
        (attr) => {
          let value = attr.value;
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) value = parsed;
          } catch (e) {}

          return {
            ...attr,
            value,
          };
        },
      );

      return {
        id: productJson.id,
        title: productJson.name,
        name: productJson.name,
        description: productJson.description,
        categoryId: productJson.categoryId,
        image: mainImage ? `http://localhost:5000${mainImage.imageUrl}` : null,
        imageUrl: mainImage
          ? `http://localhost:5000${mainImage.imageUrl}`
          : null,
        ProductImages: productJson.ProductImages,
        ProductAttributeValues: normalizedAttributes,
        createdAt: productJson.createdAt,
      };
    });

    res.json({
      success: true,
      data: normalizedProducts,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Auto-complete/suggestions endpoint
export const searchSuggestions = async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.trim().length < 1) {
      return res.json({ suggestions: [] });
    }

    // Get product name suggestions
    const products = await Product.findAll({
      where: {
        name: { [Op.like]: `%${q}%` },
      },
      attributes: ["id", "name"],
      limit: parseInt(limit),
      order: [["name", "ASC"]],
    });

    // Get unique category suggestions based on search
    const categories = await Product.findAll({
      where: {
        name: { [Op.like]: `%${q}%` },
      },
      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
      group: ["categoryId"],
      limit: parseInt(limit),
    });

    res.json({
      suggestions: {
        products: products.map((p) => ({
          id: p.id,
          name: p.name,
        })),
        categories: [
          ...new Set(categories.map((p) => p.Category?.name).filter(Boolean)),
        ],
      },
    });
  } catch (error) {
    console.error("Suggestion error:", error);
    res.status(500).json({ error: error.message });
  }
};
export const createProduct = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { name, description, categoryId, attributes } = req.body;
    console.log("RAW:", attributes);

    const parsedAttributes = JSON.parse(attributes || "[]");

    // ✅ AND HERE 👇
    console.log("PARSED:", parsedAttributes);

    const product = await Product.create(
      { name, description, categoryId },
      { transaction: t },
    );

    const validAttributes = await Attribute.findAll({
      where: { categoryId },
    });

    const validIds = validAttributes.map((a) => a.id);

    // =========================
    // ATTRIBUTES FIX (MULTI VALUE SUPPORT)
    // =========================
    for (const attr of parsedAttributes) {
      if (!validIds.includes(attr.attributeId)) continue;

      let valueToStore = attr.value;

      if (Array.isArray(attr.value)) {
        valueToStore = JSON.stringify(attr.value);
      }
      console.log("SAVING ATTR:", attr);
      await ProductAttributeValue.create(
        {
          productId: product.id,
          attributeId: attr.attributeId,
          value: valueToStore,
        },
        { transaction: t },
      );
    }

    // =========================
    // IMAGES
    // =========================
    const mainIndex = req.body.mainImageIndex || 0;
    if (req.files?.length) {
      for (let i = 0; i < req.files.length; i++) {
        await ProductImage.create(
          {
            productId: product.id,
            imageUrl: `/uploads/${req.files[i].filename}`,
            isMain: i == mainIndex, // ⭐ مهم
          },
          { transaction: t },
        );
      }
    }

    await t.commit();

    res.status(201).json(product);
  } catch (err) {
    console.log("❌ CREATE PRODUCT ERROR:", err); // ADD THIS
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
export const getProducts = async (req, res) => {
  const data = await Product.findAll({
    include: [
      ProductImage,
      {
        model: ProductAttributeValue,
        include: [
          {
            model: Attribute, // ✅ MUST be explicit + safe
            attributes: ["id", "name", "type", "allowMultiple"],
          },
        ],
      },
    ],
  });

  const normalized = data.map((p) => {
    const product = p.toJSON();

    product.ProductAttributeValues = product.ProductAttributeValues?.map(
      (attr) => {
        let value = attr.value;

        try {
          value = JSON.parse(value); // ⭐ تبدیل string به array
        } catch {}

        return {
          ...attr,
          value,
        };
      },
    );

    return product;
  });

  res.json(normalized);
};

// GET ONE
export const getProduct = async (req, res) => {
  const data = await Product.findByPk(req.params.id, {
    include: [ProductImage, ProductAttributeValue],
  });

  const product = data.toJSON();

  product.ProductAttributeValues = product.ProductAttributeValues?.map(
    (attr) => {
      let value = attr.value;

      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) value = parsed;
      } catch {}

      return {
        ...attr,
        value,
      };
    },
  );

  res.json(product);
};

// UPDATE
export const updateProduct = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { name, description, attributes } = req.body;

    const parsedAttributes = JSON.parse(attributes || "[]");

    // 1. UPDATE PRODUCT (only once)
    await Product.update(
      { name, description },
      { where: { id: req.params.id }, transaction: t },
    );

    // 2. DELETE OLD ATTRIBUTES
    await ProductAttributeValue.destroy({
      where: { productId: req.params.id },
      transaction: t,
    });

    // 3. INSERT NEW ATTRIBUTES
    for (const attr of parsedAttributes) {
      let valueToStore = attr.value;

      if (Array.isArray(attr.value)) {
        valueToStore = JSON.stringify(attr.value);
      }

      await ProductAttributeValue.create(
        {
          productId: req.params.id,
          attributeId: attr.attributeId,
          value: valueToStore,
        },
        { transaction: t },
      );
    }

    await t.commit();
    res.json({ message: "updated" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};
// DELETE
export const deleteProduct = async (req, res) => {
  await Product.destroy({ where: { id: req.params.id } });
  res.json({ message: "deleted" });
};
