const express = require('express');
const Event = require('../models/event');
const User = require('../models/user');
const EventUser = require('../models/eventUser');

const router = express.Router();

// Adaugă un user la un event
router.post('/events/:eventId/users/:userId', async (req, res, next) => {
    try {
        const { eventId, userId } = req.params;

        // Verifică dacă event-ul există
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: `Event with id ${eventId} not found` });
        }

        // Verifică dacă user-ul există
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: `User with id ${userId} not found` });
        }

        // Verifică dacă relația există deja
        const existingRelation = await EventUser.findOne({
            where: { eventId, userId }
        });
        if (existingRelation) {
            return res.status(400).json({ error: 'User is already registered to this event' });
        }

        // Creează relația
        const eventUser = await EventUser.create({ eventId, userId });
        res.status(201).json({ 
            message: `User ${user.firstName} ${user.lastName} added to event ${event.name}`,
            eventUser 
        });
    } catch (err) {
        next(err);
    }
});

// Șterge un user dintr-un event
router.delete('/events/:eventId/users/:userId', async (req, res, next) => {
    try {
        const { eventId, userId } = req.params;

        // Găsește user-ul și event-ul pentru mesaj
        const user = await User.findByPk(userId);
        const event = await Event.findByPk(eventId);

        const deleted = await EventUser.destroy({
            where: { eventId, userId }
        });

        if (deleted) {
            res.status(200).json({ 
                message: `User ${user.firstName} ${user.lastName} removed from event ${event.name}` 
            });
        } else {
            res.status(404).json({ error: 'Relation not found' });
        }
    } catch (err) {
        next(err);
    }
});

// Obține toți userii unui event
router.get('/events/:eventId/users', async (req, res, next) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findByPk(eventId, {
            include: [{
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'email', 'eventPlanner'],
                through: { attributes: [] } // Nu include coloanele din tabela de joncțiune
            }]
        });

        if (!event) {
            return res.status(404).json({ error: `Event with id ${eventId} not found` });
        }

        res.status(200).json({
            message: `Found ${event.Users.length} users for event ${event.name}`,
            users: event.Users
        });
    } catch (err) {
        next(err);
    }
});

// Obține toate evenimentele unui user
router.get('/users/:userId/events', async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId, {
            include: [{
                model: Event,
                attributes: ['id', 'name', 'state', 'startTime', 'endTime'],
                through: { attributes: [] }
            }]
        });

        if (!user) {
            return res.status(404).json({ error: `User with id ${userId} not found` });
        }

        res.status(200).json({
            message: `Found ${user.Events.length} events for user ${user.firstName} ${user.lastName}`,
            events: user.Events
        });
    } catch (err) {
        next(err);
    }
});

// Obține toate relațiile (pentru debug)
router.get('/event-users', async (req, res, next) => {
    try {
        const eventUsers = await EventUser.findAll();
        res.status(200).json({
            message: `Found ${eventUsers.length} event-user relations`,
            eventUsers
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
