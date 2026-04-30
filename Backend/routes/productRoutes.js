// routes/productRoutes.js

import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProducts, // ✅ اضافه کن
  searchSuggestions, // ✅ اضافه کن
} from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();
router.get("/search/advanced", searchProducts);
router.get("/search/suggestions", searchSuggestions);
router.post("/", upload.array("images"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
