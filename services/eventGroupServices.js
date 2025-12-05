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
            const events = await EventGroup.findAll();
            res.status(200).json(events);
        } catch (err) {
            next(err);
        }
    })
    .post(async (req, res) => {
        try {
            const object = await EventGroup.create(req.body);

            res.json(object);
        } catch (err) {
            next(err);
        }
    });

//id request
router
    .route('/eventGroup/:id')
    .get(async (req, res) => {
        try {
            const obj = await EventGroup.findByPk(req.params.id);
            if (obj) {
                res.status(200).json(obj);

            } else {
                res.status(404).json({ error: `EVent Group with id: ${req.params.id} not found` })
            }
        } catch (err) {
            res.status(500).json(err);
        }
    })
    .put(async (req, res) => {
        try {
            const obj = await EventGroup.findByPk(req.params.id);
            if (obj) {
                const updatedObj = await obj.update(req.body)
                res.status(200).json(updatedObj);

            } else {
                res.status(404).json({ error: `Event Group with id: ${req.params.id} not found` })
            }
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res) => {
        try {
            const obj = await EventGroup.findByPk(req.params.id);
            if (obj) {
                const result = await obj.destroy();
                res.status(200).send(`Event Group with id ${req.params.id} is deleted`);

            } else {
                res.status(404).json({ error: `Event Group with id: ${req.params.id} not found` })
            }
        } catch (err) {
           next(err);
        }
    })


module.exports = router