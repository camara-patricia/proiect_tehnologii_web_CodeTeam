const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    
    id: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            len: [3,10]
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            len:[3,10]
        }
    },
    email:{
        type: DataTypes.STRING,
        validate: {
            isEmail:true
        }
        
    },
    eventPlanner:{
        type: DataTypes.BOOLEAN,
        default: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            len:[5,10]
        }
    }
})


module.exports = User