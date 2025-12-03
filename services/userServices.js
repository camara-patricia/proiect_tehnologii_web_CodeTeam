const User = require('../models/user');

const express = require('express');
const { Op } = require('sequelize');

const router = express.Router();
//console.log("User router loaded");

router
    .route('/users')
    .get(async (req, res) => {
        try {
            const events = await User.findAll();
            res.status(200).json(events);
        } catch (err) {
            res.status(500).json({ error: 'Failed to retrieve events', details: err});
        }
    })
    .post(async (req, res) => {
        try {
            const object = await User.create(req.body);

            res.json(object);
        } catch (err) {
            res.status(500).json(err);
        }
    });

//WHERE clause
router.route('/users/filter').get(async (req, res) => {
    const { planner, lastName, firstName } = req.query;

    try {
        const conditions = [];
        if (lastName) {
            conditions.push({ lastName });
        }
        if (firstName) {
            conditions.push({ firstName });
        }

        let plannerBool = undefined;
        if (planner !== undefined) {
            plannerBool = planner === "true";
        }

        const whereClause = {
            ...(conditions.length > 0 && { [Op.or]: conditions }),
            ...(plannerBool !== undefined && { eventPlanner: plannerBool }),
        };

        const users = await User.findAll({where: whereClause});
        res.status(200).json(users);

    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve filtered employees', details: err });
    }
});

//id request
router
    .route('/user/:id')
    .get(async (req, res) => {
        try {
            const obj = await User.findByPk(req.params.id);
            if (obj) {
                res.status(200).json(obj);

            } else {
                res.status(404).json({ error: `User with id: ${req.params.id} not found` })
            }
        } catch (err) {
            res.status(500).json(err);
        }
    })
    .put(async (req, res) => {
        try {
            const obj = await User.findByPk(req.params.id);
            if (obj) {
                const updatedObj = await obj.update(req.body)
                res.status(200).json(updatedObj);

            } else {
                res.status(404).json({ error: `User with id: ${req.params.id} not found` })
            }
        } catch (err) {
            res.status(500).json(err);
        }
    })
    .delete(async (req, res) => {
        try {
            const obj = await User.findByPk(req.params.id);
            if (obj) {
                const result = await obj.destroy();
                res.status(200).send(`User with id ${req.params.id} is deleted`);

            } else {
                res.status(404).json({ error: `User with id: ${req.params.id} not found` })
            }
        } catch (err) {
            res.status(500).json(err);
        }
    })

//simplify
router.get('/simplified-users', async (req, res) => {

    try {
        const objs = await User.findAll(
            {
                attributes: ['firstName' , 'lastName', 'eventPlanner']
            });
        res.status(200).json(objs);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router