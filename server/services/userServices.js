const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

// /users
router
  .route('/users')
  .get(async (req, res, next) => {
    try {
      const users = await User.findAll({ attributes: { exclude: ['password'] } });
      res.status(200).json({ message: `Found ${users.length} users`, users });
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try {
      // dacă vine parola în body, o hash-uim ca să nu fie în clar
      const payload = { ...req.body };
      if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, 10);
      }

      const user = await User.create(payload);

      // nu returnăm parola
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        eventPlanner: user.eventPlanner,
      };

      res.status(201).json({
        message: `User ${user.firstName} ${user.lastName} created successfully`,
        user: safeUser,
      });
    } catch (err) {
      next(err);
    }
  });

// /users/filter
router.get('/users/filter', async (req, res, next) => {
  const { planner, lastName, firstName } = req.query;

  try {
    const conditions = [];
    if (lastName) conditions.push({ lastName });
    if (firstName) conditions.push({ firstName });

    let plannerBool;
    if (planner !== undefined) plannerBool = planner === 'true';

    const whereClause = {
      ...(conditions.length > 0 && { [Op.or]: conditions }),
      ...(plannerBool !== undefined && { eventPlanner: plannerBool }),
    };

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] }, //  nu trimitem parola
    });

    res.status(200).json({ message: `Found ${users.length} users matching filter`, users });
  } catch (err) {
    next(err);
  }
});

// /user/:id
router
  .route('/user/:id')
  .get(async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }, // nu trimitem parola
      });

      if (!user) return res.status(404).json({ error: `User with id: ${req.params.id} not found` });

      res.status(200).json({ message: `User ${user.firstName} ${user.lastName} found`, user });
    } catch (err) {
      next(err);
    }
  })
  .put(async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: `User with id: ${req.params.id} not found` });

      const payload = { ...req.body };
      if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, 10); // dacă schimbi parola, o hash-uim
      }

      const updatedUser = await user.update(payload);

      res.status(200).json({
        message: `User ${updatedUser.firstName} ${updatedUser.lastName} updated successfully`,
        user: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          eventPlanner: updatedUser.eventPlanner,
        },
      });
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: `User with id: ${req.params.id} not found` });

      const { firstName, lastName } = user;
      await user.destroy();
      res.status(200).json({ message: `User ${firstName} ${lastName} deleted successfully` });
    } catch (err) {
      next(err);
    }
  });

// /simplified-users
router.get('/simplified-users', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['firstName', 'lastName', 'eventPlanner'],
    });
    res.status(200).json({ message: `Found ${users.length} simplified users`, users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
