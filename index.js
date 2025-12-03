"use strict"

const express = require("express");
const sequelize = require("./sequelize");

// router
const router = require('./services/projectServices');
// entities

require('./models/event');
require('./models/eventGroup');
require('./models/user');

const app = express();
app.use(express.json());

app.use('/api', router);
app.listen(8080, async () => {
    console.log("Server started on http://localhost:8080")

    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully");

    } catch (err) {
        console.error("Unable to connect to the database: ", err);
    }
})