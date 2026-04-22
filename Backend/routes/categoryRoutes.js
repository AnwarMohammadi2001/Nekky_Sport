// routes/categoryRoutes.js

import express from "express";
import upload from "../middleware/upload.js";

import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// CREATE with image
router.post("/", upload.single("image"), createCategory);

// UPDATE with image
router.put("/:id", upload.single("image"), updateCategory);

// READ
router.get("/", getCategories);
router.get("/:id", getCategory);

// DELETE
router.delete("/:id", deleteCategory);

export default router;
