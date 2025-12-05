const EventGroup = require('../models/eventGroup');

const express = require('express');
const { Op } = require('sequelize');

const router = express.Router();

// // Create a middleware to handle 500 status errors.
// app.use((err, req, res, next) => {
//   console.error("[ERROR]:" + err);
//   res.status(500).json({ message: "500 - Server Error" });
// });


router
    .route('/eventGroups')
    .get(async (req, res) => {
        try {
            const eventGroups = await EventGroup.findAll();
            res.status(200).json({
                message: `Found ${eventGroups.length} event groups`,
                eventGroups
            });
        } catch (err) {
            next(err);
        }
    })
    .post(async (req, res) => {
        try {
            const eventGroup = await EventGroup.create(req.body);
            res.status(201).json({
                message: `Event group ${eventGroup.name} created successfully`,
                eventGroup
            });
        } catch (err) {
            next(err);
        }
    });

//id request
router
    .route('/eventGroup/:id')
    .get(async (req, res) => {
        try {
            const eventGroup = await EventGroup.findByPk(req.params.id);
            if (eventGroup) {
                res.status(200).json({
                    message: `Event group ${eventGroup.name} found`,
                    eventGroup
                });
            } else {
                res.status(404).json({ error: `Event Group with id: ${req.params.id} not found` })
            }
        } catch (err) {
            res.status(500).json(err);
        }
    })
    .put(async (req, res) => {
        try {
            const eventGroup = await EventGroup.findByPk(req.params.id);
            if (eventGroup) {
                const updatedEventGroup = await eventGroup.update(req.body)
                res.status(200).json({
                    message: `Event group ${updatedEventGroup.name} updated successfully`,
                    eventGroup: updatedEventGroup
                });
            } else {
                res.status(404).json({ error: `Event Group with id: ${req.params.id} not found` })
            }
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res) => {
        try {
            const eventGroup = await EventGroup.findByPk(req.params.id);
            if (eventGroup) {
                const name = eventGroup.name;
                await eventGroup.destroy();
                res.status(200).json({
                    message: `Event group ${name} deleted successfully`
                });
            } else {
                res.status(404).json({ error: `Event Group with id: ${req.params.id} not found` })
            }
        } catch (err) {
           next(err);
        }
    })


module.exports = router