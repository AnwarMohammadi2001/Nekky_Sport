import React, { useState } from "react";
import {
  createAttribute,
  getAttributesByCategory,
  updateAttribute,
  deleteAttribute,
} from "../api/api";

const AttributesTab = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [attrName, setAttrName] = useState("");
  const [attrType, setAttrType] = useState("input");
  const [attrOptions, setAttrOptions] = useState("");
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);

  // =========================
  // LOADING STATES
  // =========================
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loadingAttributes, setLoadingAttributes] = useState(false);

  const loadAttributesForCategory = async (categoryId) => {
    if (categoryId) {
      try {
        setLoadingAttributes(true);
        const res = await getAttributesByCategory(categoryId);
        setAttributes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAttributes(false);
      }
    } else {
      setAttributes([]);
    }
  };

  const resetForm = () => {
    setAttrName("");
    setAttrOptions("");
    setAttrType("input");
    setAllowMultiple(false);
    setEditingAttribute(null);
  };

  const buildOptionsArray = () =>
    attrType === "select"
      ? attrOptions
          .split(",")
          .map((o) => o.trim())
          .filter((o) => o)
      : [];

  const handleCreateAttribute = async () => {
    if (submitting) return; // 🔒 block double-click
    if (!attrName.trim()) return alert("Attribute name required");
    if (!selectedCategory) return alert("Select a category first");

    try {
      setSubmitting(true);
      await createAttribute({
        name: attrName,
        type: attrType,
        categoryId: selectedCategory,
        options: buildOptionsArray(),
        allowMultiple: allowMultiple,
      });

      resetForm();
      loadAttributesForCategory(selectedCategory);
    } catch (err) {
      console.error(err);
      alert("Failed to create attribute. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAttribute = async () => {
    if (submitting) return; // 🔒 block double-click
    if (!attrName.trim()) return;

    try {
      setSubmitting(true);
      await updateAttribute(editingAttribute.id, {
        name: attrName,
        type: attrType,
        options: buildOptionsArray(),
        allowMultiple: allowMultiple,
      });

      resetForm();
      loadAttributesForCategory(selectedCategory);
    } catch (err) {
      console.error(err);
      alert("Failed to update attribute. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAttribute = async (id) => {
    if (deletingId) return; // 🔒 one delete at a time
    if (!window.confirm("Delete this attribute?")) return;

    try {
      setDeletingId(id);
      await deleteAttribute(id);
      loadAttributesForCategory(selectedCategory);
    } catch (err) {
      console.error(err);
      alert("Failed to delete attribute. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const startEditAttribute = (attr) => {
    if (submitting || deletingId) return;
    setEditingAttribute(attr);
    setAttrName(attr.name);
    setAttrType(attr.type);
    setAllowMultiple(attr.allowMultiple || false);
    if (attr.AttributeOptions) {
      setAttrOptions(attr.AttributeOptions.map((opt) => opt.value).join(", "));
    } else {
      setAttrOptions("");
    }
  };

  const cancelEditAttribute = () => {
    if (submitting) return;
    resetForm();
  };

  const isBusy = submitting || deletingId !== null;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingAttribute ? "✏️ Edit Attribute" : "➕ Create Attribute"}
        </h2>
        <div className="space-y-4">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              loadAttributesForCategory(e.target.value);
            }}
            disabled={submitting}
          >
            <option value="">Select Category First</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Attribute name (e.g., Color, Size, Brand)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            value={attrName}
            onChange={(e) => setAttrName(e.target.value)}
            disabled={submitting}
          />

          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
            value={attrType}
            onChange={(e) => setAttrType(e.target.value)}
            disabled={submitting}
          >
            <option value="input">Text Input</option>
            <option value="select">Dropdown Select</option>
          </select>

          {attrType === "select" && (
            <>
              <input
                type="text"
                placeholder="Options (comma separated: Red, Blue, Green)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
                value={attrOptions}
                onChange={(e) => setAttrOptions(e.target.value)}
                disabled={submitting}
              />

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowMultiple}
                  onChange={(e) => setAllowMultiple(e.target.checked)}
                  disabled={submitting}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  Allow multiple selections (e.g., choose several sizes)
                </span>
              </label>
            </>
          )}

          <div className="flex gap-3">
            {editingAttribute ? (
              <>
                <button
                  onClick={handleUpdateAttribute}
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg text-white transition flex items-center gap-2 ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {submitting && (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {submitting ? "Updating..." : "Update Attribute"}
                </button>
                <button
                  onClick={cancelEditAttribute}
                  disabled={submitting}
                  className={`px-4 py-2 rounded-lg transition ${
                    submitting
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleCreateAttribute}
                disabled={!selectedCategory || submitting}
                className={`px-4 py-2 rounded-lg text-white transition flex items-center gap-2 ${
                  !selectedCategory || submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {submitting && (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {submitting ? "Adding..." : "Add Attribute"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          🏷️ Attributes for{" "}
          {categories.find((c) => c.id === selectedCategory)?.name ||
            "Selected Category"}
        </h2>

        {loadingAttributes ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 py-8">
            <span className="inline-block w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            Loading attributes...
          </div>
        ) : !selectedCategory ? (
          <p className="text-gray-500 text-center py-8">
            Select a category to view attributes
          </p>
        ) : attributes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No attributes yet for this category
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {attributes.map((attr) => {
              const isDeleting = deletingId === attr.id;
              return (
                <div
                  key={attr.id}
                  className={`bg-white p-3 rounded-lg border border-gray-200 relative ${
                    isDeleting ? "opacity-60" : ""
                  }`}
                >
                  {isDeleting && (
                    <div className="absolute inset-0 bg-white/40 flex items-center justify-center rounded-lg">
                      <span className="inline-block w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-gray-800">
                        {attr.name}
                      </span>
                      <span
                        className={`ml-2 text-xs px-2 py-1 rounded-full ${
                          attr.type === "select"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {attr.type === "select" ? "Dropdown" : "Text Input"}
                      </span>
                      {attr.allowMultiple && (
                        <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Multi-Select
                        </span>
                      )}
                      {attr.type === "select" && attr.AttributeOptions && (
                        <div className="text-xs text-gray-500 mt-1">
                          Options:{" "}
                          {attr.AttributeOptions.map((o) => o.value).join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditAttribute(attr)}
                        disabled={isBusy}
                        className={`px-2 py-1 text-xs rounded transition ${
                          isBusy
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAttribute(attr.id)}
                        disabled={isBusy}
                        className={`px-2 py-1 text-xs rounded transition flex items-center gap-1 ${
                          isBusy
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {isDeleting && (
                          <span className="inline-block w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        )}
                        Delete
                      </button>
                    </div>
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

export default AttributesTab;