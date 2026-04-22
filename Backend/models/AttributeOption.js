// models/AttributeOption.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AttributeOption = sequelize.define("AttributeOption", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  attributeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default AttributeOption;
