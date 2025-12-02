const {DataTypes} = require("sequelize");
const sequelize = require("../sequelize");

//2. Entities

const Event = sequelize.define(
    "Event",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            validate: {
                len:[5,50]
            }
        },
        state: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['OPEN', 'CLOSED']]
            },
            allowNull: false,
            defaultValue: 'CLOSED'
        },
         groupId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }, 
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isAfterStart(value) {
                    if (value <= this.startTime) {
                        throw new Error("endTime must be after startTime");
                    }
                }
            }
        },
        accessCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        qrCodePath: {
            type: DataTypes.STRING,
            allowNull: true
        }

    }
)

module.exports = Event