"use strict"

const express = require("express");
const sequelize = require("./sequelize");

// router
// Import routers
const eventRouter = require("./services/eventServices");
const eventGroupRouter = require("./services/eventGroupServices");
const userRouter = require("./services/userServices");

require('./models/event');
require('./models/eventGroup');
require('./models/user');

const app = express();


app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());



// Bind routers
app.use("/api", eventRouter);
app.use("/api", eventGroupRouter);
app.use("/api", userRouter);
app.listen(8080, async () => {
    console.log("Server started on http://localhost:8080")

    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully");

    } catch (err) {
        console.error("Unable to connect to the database:", err);
    }
});

// Create a middleware to handle 500 status errors.
app.use((err, req, res, next) => {
  console.error("[ERROR]:" + err);
  res.status(500).json({ message: "500 - Server Error" });
});

