// models/ProductImage.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ProductImage = sequelize.define("ProductImage", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  isMain: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default ProductImage;
