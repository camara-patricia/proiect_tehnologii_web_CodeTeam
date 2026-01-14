const express = require('express');
const Event = require('../models/event');
const User = require('../models/user');
const EventUser = require('../models/eventUser');

const router = express.Router();

// Endpoint pentru obtinerea participantilor unui eveniment:
// cauta evenimentul dupa ID, preia utilizatorii asociati,
// si returneaza lista participantilor cu data confirmarii
router.get('/events/:eventId/participants', async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'email', 'eventPlanner'],
        through: { attributes: ['createdAt'] } // timestamp-ul confirmării
      }]
    });

    if (!event) {
      return res.status(404).json({ error: `Event with id ${eventId} not found` });
    }

    const participants = (event.Users || []).map(u => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      eventPlanner: u.eventPlanner,
      confirmedAt: u.EventUser?.createdAt
    }));

    return res.status(200).json({
      message: `Found ${participants.length} participants for event ${event.name}`,
      participants
    });
  } catch (err) {
    next(err);
  }
});

// Endpoint pentru confirmarea prezentei la un eveniment:
// valideaza eventId si accessCode, verifica existenta evenimentului si codul de acces,
// verifica existenta userului, previne inscrierea duplicata si salveaza confirmarea in EventUser
router.post('/events/attend', async (req, res, next) => {
  try {
    const { eventId, accessCode, userId } = req.body;

    if (!eventId || !accessCode) {
      return res.status(400).json({ message: 'eventId și accessCode sunt obligatorii' });
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // verifică codul de acces
    if (event.accessCode !== accessCode) {
      return res.status(401).json({ message: 'Cod de acces invalid' });
    }

    // minim pentru proiect dacă nu ai autentificare reală:
    if (!userId) {
      return res.status(400).json({ message: 'userId este obligatoriu (minim fără sesiune)' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // nu permite duplicate
    const existing = await EventUser.findOne({ where: { eventId, userId } });
    if (existing) {
      return res.status(400).json({ message: 'Prezența a fost deja marcată' });
    }

    const eventUser = await EventUser.create({ eventId, userId });

    return res.status(201).json({
      message: 'Prezență confirmată',
      confirmedAt: eventUser.createdAt
    });
  } catch (err) {
    next(err);
  }
});

// Endpoint pentru export CSV al participantilor unui eveniment:
// verifica existenta evenimentului, preia utilizatorii asociati,
// genereaza continutul CSV si il trimite ca fisier descarcabil
router.get('/events/:eventId/export', async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
      include: [{
        model: User,
        attributes: ['firstName', 'lastName', 'email'],
        through: { attributes: ['createdAt'] }
      }]
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const header = 'FirstName,LastName,Email,ConfirmedAt\n';
    const rows = (event.Users || []).map(u =>
      `${u.firstName},${u.lastName},${u.email},${u.EventUser?.createdAt ?? ''}`
    ).join('\n');

    const csv = header + rows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="event_${eventId}_participants.csv"`);
    return res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
