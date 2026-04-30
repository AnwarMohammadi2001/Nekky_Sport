import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Attribute = sequelize.define("Attribute", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("input", "select"),
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  allowMultiple: {
    // NEW: field for multi-select support
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default Attribute;
