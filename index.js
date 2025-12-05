"use strict"

const express = require("express");
const sequelize = require("./sequelize");

// router
// Import routers
const eventRouter = require("./services/eventServices");
const eventGroupRouter = require("./services/eventGroupServices");
const userRouter = require("./services/userServices");
const eventUserRouter = require("./services/eventUserServices");

//Import models to create associations
const Event =  require('./models/event');
const EventGroup = require('./models/eventGroup');
const User = require('./models/user');
const EventUser = require('./models/eventUser');

EventGroup.hasMany(Event, { foreignKey: 'groupId', onDelete: 'CASCADE' });
Event.belongsTo(EventGroup, { foreignKey: 'groupId' });

Event.belongsToMany(User, { through: 'EventUser', foreignKey: 'eventId' });
User.belongsToMany(Event, { through: 'EventUser', foreignKey: 'userId' });

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
app.use("/api", eventUserRouter);
app.get("/create", async (req, res, next) => {
  try {
    await sequelize.sync({ force: true });
    res.status(201).json({ message: "Database created with the models." });
  } catch (err) {
    next(err);
  }
});

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


// - middle ware pentru erori (easier, fancier)
// - hasmany si fkeys ---> belongsTo
