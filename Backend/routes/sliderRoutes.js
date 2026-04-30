import express from "express";
import {
  createSlider,
  getSliders,
  getSlider,
  updateSlider,
  deleteSlider,
} from "../controllers/sliderController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// CREATE
router.post("/", upload.single("image"), createSlider);

// GET ALL
router.get("/", getSliders);

// GET ONE
router.get("/:id", getSlider);

// UPDATE
router.put("/:id", upload.single("image"), updateSlider);

// DELETE
router.delete("/:id", deleteSlider);

export default router;
