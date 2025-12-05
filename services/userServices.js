const User = require('../models/user');

const express = require('express');
const { Op } = require('sequelize');

const router = express.Router();
//console.log("User router loaded");

// Create a middleware to handle 500 status errors.
// app.use((err, req, res, next) => {
//   console.error("[ERROR]:" + err);
//   res.status(500).json({ message: "500 - Server Error" });
// });


router
    .route('/users')
    .get(async (req, res) => {
        try {
            const users = await User.findAll();
            res.status(200).json({
                message: `Found ${users.length} users`,
                users
            });
        } catch (err) {
            next(err);
        }
    })
    .post(async (req, res) => {
        try {
            const user = await User.create(req.body);
            res.status(201).json({
                message: `User ${user.firstName} ${user.lastName} created successfully`,
                user
            });
        } catch (err) {
            next(err);
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
        res.status(200).json({
            message: `Found ${users.length} users matching filter`,
            users
        });
        

    } catch (err) {
        next(err);
    }
});

//id request
router
    .route('/user/:id')
    .get(async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                res.status(200).json({
                    message: `User ${user.firstName} ${user.lastName} found`,
                    user
                });
            } else {
                res.status(404).json({ error: `User with id: ${req.params.id} not found` })
            }
        } catch (err) {
            next(err);
        }
    })
    .put(async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                const updatedUser = await user.update(req.body)
                res.status(200).json({
                    message: `User ${updatedUser.firstName} ${updatedUser.lastName} updated successfully`,
                    user: updatedUser
                });
            } else {
                res.status(404).json({ error: `User with id: ${req.params.id} not found` })
            }
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                const firstName = user.firstName;
                const lastName = user.lastName;
                await user.destroy();
                res.status(200).json({
                    message: `User ${firstName} ${lastName} deleted successfully`
                });
            } else {
                res.status(404).json({ error: `User with id: ${req.params.id} not found` })
            }
        } catch (err) {
            next(err);
        }
    })

//simplify
router.get('/simplified-users', async (req, res) => {

    try {
        const users = await User.findAll(
            {
                attributes: ['firstName' , 'lastName', 'eventPlanner']
            });
        res.status(200).json({
            message: `Found ${users.length} simplified users`,
            users
        });
    } catch (err) {
        next(err);
    }
})

module.exports = router