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

  const loadAttributesForCategory = async (categoryId) => {
    if (categoryId) {
      const res = await getAttributesByCategory(categoryId);
      setAttributes(res.data);
    } else {
      setAttributes([]);
    }
  };

  const handleCreateAttribute = async () => {
    if (!attrName.trim()) return alert("Attribute name required");
    if (!selectedCategory) return alert("Select a category first");

    const optionsArray =
      attrType === "select"
        ? attrOptions
            .split(",")
            .map((o) => o.trim())
            .filter((o) => o)
        : [];

    await createAttribute({
      name: attrName,
      type: attrType,
      categoryId: selectedCategory,
      options: optionsArray,
      allowMultiple: allowMultiple,
    });

    setAttrName("");
    setAttrOptions("");
    setAttrType("input");
    setAllowMultiple(false);
    loadAttributesForCategory(selectedCategory);
  };

  const handleUpdateAttribute = async () => {
    if (!attrName.trim()) return;

    const optionsArray =
      attrType === "select"
        ? attrOptions
            .split(",")
            .map((o) => o.trim())
            .filter((o) => o)
        : [];

    await updateAttribute(editingAttribute.id, {
      name: attrName,
      type: attrType,
      options: optionsArray,
      allowMultiple: allowMultiple,
    });

    setEditingAttribute(null);
    setAttrName("");
    setAttrOptions("");
    setAttrType("input");
    setAllowMultiple(false);
    loadAttributesForCategory(selectedCategory);
  };

  const handleDeleteAttribute = async (id) => {
    if (window.confirm("Delete this attribute?")) {
      await deleteAttribute(id);
      loadAttributesForCategory(selectedCategory);
    }
  };

  const startEditAttribute = (attr) => {
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
    setEditingAttribute(null);
    setAttrName("");
    setAttrOptions("");
    setAttrType("input");
    setAllowMultiple(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {editingAttribute ? "✏️ Edit Attribute" : "➕ Create Attribute"}
        </h2>
        <div className="space-y-4">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              loadAttributesForCategory(e.target.value);
            }}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={attrName}
            onChange={(e) => setAttrName(e.target.value)}
          />

          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={attrType}
            onChange={(e) => setAttrType(e.target.value)}
          >
            <option value="input">Text Input</option>
            <option value="select">Dropdown Select</option>
          </select>

          {attrType === "select" && (
            <>
              <input
                type="text"
                placeholder="Options (comma separated: Red, Blue, Green)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={attrOptions}
                onChange={(e) => setAttrOptions(e.target.value)}
              />

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowMultiple}
                  onChange={(e) => setAllowMultiple(e.target.checked)}
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Update Attribute
                </button>
                <button
                  onClick={cancelEditAttribute}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleCreateAttribute}
                disabled={!selectedCategory}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                Add Attribute
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
        {!selectedCategory ? (
          <p className="text-gray-500 text-center py-8">
            Select a category to view attributes
          </p>
        ) : attributes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No attributes yet for this category
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {attributes.map((attr) => (
              <div
                key={attr.id}
                className="bg-white p-3 rounded-lg border border-gray-200"
              >
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
                      className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAttribute(attr.id)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttributesTab;
