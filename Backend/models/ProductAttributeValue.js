// models/ProductAttributeValue.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ProductAttributeValue = sequelize.define("ProductAttributeValue", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  attributeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default ProductAttributeValue;
