// models/Category.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Category = sequelize.define("Category", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },

  image: {
    type: DataTypes.STRING, // مسیر عکس
    allowNull: true,
  },
});

export default Category;
