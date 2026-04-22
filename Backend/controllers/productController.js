// controllers/productController.js

import {
  Product,
  ProductImage,
  ProductAttributeValue,
  Attribute,
} from "../models/index.js";
import sequelize from "../config/db.js";

export const createProduct = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { name, price, stock, description, categoryId, attributes } =
      req.body;

    const product = await Product.create(
      { name, price, stock, description, categoryId },
      { transaction: t },
    );

    const validAttributes = await Attribute.findAll({
      where: { categoryId },
    });

    const validIds = validAttributes.map((a) => a.id);

    // attributes
    for (const attr of attributes || []) {
      if (!validIds.includes(attr.attributeId)) continue;

      await ProductAttributeValue.create(
        {
          productId: product.id,
          attributeId: attr.attributeId,
          value: attr.value,
        },
        { transaction: t },
      );
    }

    // images
    if (req.files?.length) {
      for (let i = 0; i < req.files.length; i++) {
        await ProductImage.create(
          {
            productId: product.id,
            imageUrl: req.files[i].path,
            isMain: i === 0,
          },
          { transaction: t },
        );
      }
    }

    await t.commit();

    res.status(201).json(product);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
export const getProducts = async (req, res) => {
  const data = await Product.findAll({
    include: [ProductImage, ProductAttributeValue],
  });
  res.json(data);
};

// GET ONE
export const getProduct = async (req, res) => {
  const data = await Product.findByPk(req.params.id, {
    include: [ProductImage, ProductAttributeValue],
  });
  res.json(data);
};

// UPDATE
export const updateProduct = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { name, price, stock, description, attributes } = req.body;

    await Product.update(
      { name, price, stock, description },
      { where: { id: req.params.id }, transaction: t },
    );

    // delete old attributes
    await ProductAttributeValue.destroy({
      where: { productId: req.params.id },
      transaction: t,
    });

    // insert new
    for (const attr of attributes || []) {
      await ProductAttributeValue.create(
        {
          productId: req.params.id,
          attributeId: attr.attributeId,
          value: attr.value,
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
