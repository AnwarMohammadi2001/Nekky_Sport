import React, { useEffect, useState } from "react";
import {
  createSlider,
  getSliders,
  deleteSlider,
  updateSlider,
} from "../../api/api";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const AddSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // =========================
  // LOADING STATES
  // =========================
  const [loadingList, setLoadingList] = useState(false); // fetching list
  const [submitting, setSubmitting] = useState(false); // create/update in-flight
  const [deletingId, setDeletingId] = useState(null); // which slider is being deleted
  const [imagePreview, setImagePreview] = useState(null); // preview of chosen image

  // =========================
  // FETCH SLIDERS
  // =========================
  const fetchSliders = async () => {
    try {
      setLoadingList(true);
      const res = await getSliders();
      setSliders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // =========================
  // IMAGE PICKER
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = async () => {
    if (submitting) return; // 🔒 block double-click
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", image);

    try {
      setSubmitting(true);

      if (editingId) {
        await updateSlider(editingId, formData);
        alert("Slider updated ✅");
      } else {
        await createSlider(formData);
        alert("Slider created ✅");
      }

      // reset form
      setImage(null);
      setImagePreview(null);
      setEditingId(null);
      // clear file input
      const fileInput = document.getElementById("slider-image-input");
      if (fileInput) fileInput.value = "";

      fetchSliders();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    if (deletingId) return; // 🔒 one delete at a time
    if (!window.confirm("Delete this slider?")) return;

    try {
      setDeletingId(id);
      await deleteSlider(id);
      fetchSliders();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (slider) => {
    if (submitting) return;
    setEditingId(slider.id);
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancelEdit = () => {
    if (submitting) return;
    setEditingId(null);
    setImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById("slider-image-input");
    if (fileInput) fileInput.value = "";
  };

  // =========================
  // IMAGE URL FIX
  // =========================
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${BASE_URL}/${img}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "✏️ Edit Slider" : "➕ Add Slider"}
        </h2>

        <input
          id="slider-image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={submitting}
          className="mb-4"
        />

        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview}
              alt="preview"
              className="w-40 h-28 object-cover rounded border"
            />
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {submitting && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {submitting
              ? editingId
                ? "Updating..."
                : "Creating..."
              : editingId
              ? "Update"
              : "Create"}
          </button>

          {editingId && (
            <button
              onClick={handleCancelEdit}
              disabled={submitting}
              className={`px-4 py-2 rounded-lg ${
                submitting
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-300 text-gray-800 hover:bg-gray-400"
              }`}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">
          📸 All Sliders ({sliders.length})
        </h2>

        {loadingList ? (
          <div className="flex items-center gap-2 text-gray-500">
            <span className="inline-block w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Loading sliders...
          </div>
        ) : sliders.length === 0 ? (
          <p>No sliders yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sliders.map((slider) => {
              const isDeleting = deletingId === slider.id;
              return (
                <div
                  key={slider.id}
                  className={`border rounded-lg overflow-hidden relative ${
                    isDeleting ? "opacity-60" : ""
                  }`}
                >
                  <img
                    src={getImageUrl(slider.image)}
                    alt="slider"
                    className="w-full h-40 object-cover"
                  />

                  {/* Delete overlay spinner */}
                  {isDeleting && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  <div className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(slider)}
                      disabled={submitting || isDeleting}
                      className={`flex-1 py-1 rounded text-white ${
                        submitting || isDeleting
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-yellow-400 hover:bg-yellow-500"
                      }`}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(slider.id)}
                      disabled={deletingId !== null || submitting}
                      className={`flex-1 py-1 rounded text-white ${
                        deletingId !== null || submitting
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSlider;