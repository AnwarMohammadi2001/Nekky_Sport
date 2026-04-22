// controllers/attributeController.js

import { Attribute, AttributeOption } from "../models/index.js";

export const createAttribute = async (req, res) => {
  try {
    const { name, type, categoryId, options } = req.body;

    const attribute = await Attribute.create({
      name,
      type,
      categoryId,
    });

    // اگر select باشد → options ذخیره شود
    if (type === "select" && options?.length) {
      const data = options.map((opt) => ({
        value: opt,
        attributeId: attribute.id,
      }));

      await AttributeOption.bulkCreate(data);
    }

    res.status(201).json(attribute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAttributesByCategory = async (req, res) => {
  const data = await Attribute.findAll({
    where: { categoryId: req.params.categoryId },
    include: AttributeOption,
  });

  res.json(data);
};

export const updateAttribute = async (req, res) => {
  const { name, type, options } = req.body;

  await Attribute.update({ name, type }, { where: { id: req.params.id } });

  // delete old options
  await AttributeOption.destroy({
    where: { attributeId: req.params.id },
  });

  // add new options
  if (type === "select" && options?.length) {
    const data = options.map((opt) => ({
      value: opt,
      attributeId: req.params.id,
    }));

    await AttributeOption.bulkCreate(data);
  }

  res.json({ message: "updated" });
};

export const deleteAttribute = async (req, res) => {
  await Attribute.destroy({ where: { id: req.params.id } });
  res.json({ message: "deleted" });
};
