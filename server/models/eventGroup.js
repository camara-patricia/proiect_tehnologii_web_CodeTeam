const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const EventGroup = sequelize.define(
  "EventGroup",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
);

module.exports = EventGroup;
