const Event = require('../models/event');
const EventGroup = require('../models/eventGroup');
const User = require('../models/user');

const express = require('express');
const { Op } = require('sequelize');

const router = express.Router();

router
    .route('/event')
    .get(async (req, res) => {
        try {
            const events = await Event.findAll();
            res.status(200).json(events);
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve events', details: err});
        }
    });

module.exports = router

