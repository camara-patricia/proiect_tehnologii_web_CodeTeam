const {DataTypes} = require("sequelize");
const sequelize = require("../sequelize");

//2.Entities

const EventGroup = sequelize.define(
    "EventGroup",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    }
)

module.exports = EventGroup