import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Slider = sequelize.define("Slider", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Slider;
