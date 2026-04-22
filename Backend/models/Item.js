// models/Item.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Item = sequelize.define(
  "Item",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    featuredImage: {
      type: DataTypes.STRING(500),
    },

    // 🔥 اینجا تمام attribute ها ذخیره می‌شود
    customFields: {
      type: DataTypes.JSON,
      defaultValue: {},
    },

    status: {
      type: DataTypes.ENUM("draft", "published"),
      defaultValue: "draft",
    },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true },
);

export default Item;
