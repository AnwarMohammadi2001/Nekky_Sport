// routes/attributeRoutes.js

import express from "express";
import {
  createAttribute,
  getAttributesByCategory,
  updateAttribute,
  deleteAttribute,
} from "../controllers/attributeController.js";

const router = express.Router();

router.post("/", createAttribute);
router.get("/:categoryId", getAttributesByCategory);
router.put("/:id", updateAttribute);
router.delete("/:id", deleteAttribute);

export default router;
