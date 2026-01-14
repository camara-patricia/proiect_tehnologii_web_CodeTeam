"use strict";

const express = require("express");
const sequelize = require("./sequelize");
const cors = require("cors");

const eventRouter = require("./services/eventServices");
const eventGroupRouter = require("./services/eventGroupServices");
const userRouter = require("./services/userServices");
const eventUserRouter = require("./services/eventUserServices");
const authRouter = require("./services/authServices");

const Event = require("./models/event");
const EventGroup = require("./models/eventGroup");
const User = require("./models/user");
const EventUser = require("./models/eventUser");

EventGroup.hasMany(Event, { foreignKey: "groupId", onDelete: "CASCADE" });
Event.belongsTo(EventGroup, { foreignKey: "groupId" });

Event.belongsToMany(User, { through: "EventUser", foreignKey: "eventId" });
User.belongsToMany(Event, { through: "EventUser", foreignKey: "userId" });

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", eventRouter);
app.use("/api", eventGroupRouter);
app.use("/api", userRouter);
app.use("/api", eventUserRouter);
app.use("/api/auth", authRouter);

app.get("/create", async (req, res, next) => {
  try {
    await sequelize.sync({ force: true });
    res.status(201).json({ message: "Database created with the models." });
  } catch (err) {
    next(err);
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
  } catch (err) {
    console.error(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: "500 - Server Error" });
});
