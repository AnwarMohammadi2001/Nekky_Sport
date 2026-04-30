import { Slider } from "../models/index.js";

// ✅ CREATE
export const createSlider = async (req, res) => {
  try {
    const slider = await Slider.create({
      image: req.file ? req.file.path : null,
    });

    res.status(201).json(slider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ALL
export const getSliders = async (req, res) => {
  try {
    const data = await Slider.findAll({
      order: [["id", "DESC"]],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ONE
export const getSlider = async (req, res) => {
  try {
    const data = await Slider.findByPk(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE
export const updateSlider = async (req, res) => {
  try {
    await Slider.update(
      {
        image: req.file ? req.file.path : undefined,
      },
      { where: { id: req.params.id } },
    );

    res.json({ message: "Slider updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE
export const deleteSlider = async (req, res) => {
  try {
    await Slider.destroy({ where: { id: req.params.id } });
    res.json({ message: "Slider deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
