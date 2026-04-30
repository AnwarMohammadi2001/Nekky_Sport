import React, { useEffect, useState } from "react";
import {
  createSlider,
  getSliders,
  deleteSlider,
  updateSlider,
} from "../../api/api";

const AddSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // =========================
  // FETCH SLIDERS
  // =========================
  const fetchSliders = async () => {
    try {
      const res = await getSliders();
      setSliders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = async () => {
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", image);

    try {
      if (editingId) {
        await updateSlider(editingId, formData);
        alert("Slider updated ✅");
      } else {
        await createSlider(formData);
        alert("Slider created ✅");
      }

      setImage(null);
      setEditingId(null);
      fetchSliders();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slider?")) return;

    await deleteSlider(id);
    fetchSliders();
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (slider) => {
    setEditingId(slider.id);
  };

  // =========================
  // IMAGE URL FIX
  // =========================
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000/${img}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "✏️ Edit Slider" : "➕ Add Slider"}
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          {editingId ? "Update" : "Create"}
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">
          📸 All Sliders ({sliders.length})
        </h2>

        {sliders.length === 0 ? (
          <p>No sliders yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sliders.map((slider) => (
              <div
                key={slider.id}
                className="border rounded-lg overflow-hidden"
              >
                <img
                  src={getImageUrl(slider.image)}
                  alt="slider"
                  className="w-full h-40 object-cover"
                />

                <div className="p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(slider)}
                    className="flex-1 bg-yellow-400 text-white py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(slider.id)}
                    className="flex-1 bg-red-500 text-white py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSlider;
