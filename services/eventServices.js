const Event = require('../models/event');

const express = require('express');
const { Op } = require('sequelize');

const router = express.Router();



// Create a middleware to handle 500 status errors.
// app.use((err, req, res, next) => {
//   console.error("[ERROR]:" + err);
//   res.status(500).json({ message: "500 - Server Error" });
// });



router
    .route('/events')
    .get(async (req, res) => {
        try {
            const events = await Event.findAll();
            res.status(200).json(events);
        } catch (err) {
          next(err);
        }
    })
    .post(async (req, res) => {
        try {
            const object = await Event.create(req.body);

            res.json(object);
        } catch (err) {
            next(err);
        }
    });

//WHERE clause
router
    .route('/events/filter')
    .get(async (req, res) => {
        const { name, state, groupId} = req.query;
        try{
            const conditions = [];
            if(name){
                conditions.push({ name });
            }
            if(state){
                conditions.push({ state });
            }
            
            const whereClause = {
                ...(conditions.length > 0 && { [Op.or]: conditions }),
                ...(groupId && { groupId  : {[Op.eq]: +groupId}}),
            };

            const events = await Event.findAll({ where: whereClause });
            res.status(200).json(events);
        } catch (err) {
           next(err);
        }   
});

//id request
router
    .route('/event/:id')
    .get(async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (event) {
                res.status(200).json(event);

            } else {
                res.status(404).json({ error: `Event with id: ${req.params.id} not found` })
            }
        } catch (err) {
            next(err);
        }
    })
    .put(async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (event) {
                const updatedEvent = await event.update(req.body)
                res.status(200).json(updatedEvent);

            } else {
                res.status(404).json({ error: `Event with id: ${req.params.id} not found` })
            }
        } catch (err) {
           next(err);
        }
    })
    .delete(async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (event) {
                const result = await event.destroy();
                res.status(200).send(`Event with id ${req.params.id} is deleted`);

            } else {
                res.status(404).json({ error: `Event with id: ${req.params.id} not found` })
            }
        } catch (err) {
           next(err);
        }
    })

//simplify
router.get('/simplified-events', async (req, res) => {

    try {
        const objs = await Event.findAll(
            {
                attributes: ['name' , 'state']
            });
        res.status(200).json(objs);
    } catch (err) {
        next(err);
    }
})

//sorting based on date
router.get('/sort-employees/:field', async (req, res) => {
    try {
        const { field } = req.params;

        const allowedFields = ['startTime', 'endTime'];

        if (!allowedFields.includes(field)) {
            return res.status(400).json({ error: 'Invalid field parameter' });
        }

        const sortedObj = await Event.findAll({
            order: [[field, 'ASC']] // ASC pentru crescător, DESC pentru descrescător
        });

        res.status(200).json(sortedObj);

    } catch (err) {
        next(err);
    }
});

module.exports = router

