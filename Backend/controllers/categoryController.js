// controllers/categoryController.js

import { Category } from "../models/index.js";

// CREATE
export const createCategory = async (req, res) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      image: req.file ? req.file.path : null,
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
export const getCategories = async (req, res) => {
  try {
    const data = await Category.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE
export const getCategory = async (req, res) => {
  try {
    const data = await Category.findByPk(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateCategory = async (req, res) => {
  try {
    await Category.update(
      {
        name: req.body.name,
        image: req.file ? req.file.path : undefined,
      },
      { where: { id: req.params.id } },
    );

    res.json({ message: "updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteCategory = async (req, res) => {
  try {
    await Category.destroy({ where: { id: req.params.id } });
    res.json({ message: "deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
