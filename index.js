"use strict"

const express = require("express");
const sequelize = require("./sequelize");

// router

// entities

require('./models/events');
require('./models/eventGroup');
require('./models/user');

const app = express();
app.use(express.json());

