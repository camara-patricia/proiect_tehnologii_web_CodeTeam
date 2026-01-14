const EventGroup = require('../models/eventGroup');
const Event = require("../models/event");
const User = require("../models/user");

const express = require('express');
const { Op } = require('sequelize');

const router = express.Router();

// Endpoint pentru export CSV al participantilor dintr-un event group:
// verifica existenta grupului, preia evenimentele si utilizatorii asociati,
// construieste un fisier CSV (cu data confirmarii) si il trimite ca attachment
router.get('/event-groups/:groupId/export', async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await EventGroup.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Event group not found' });
    }

    const events = await Event.findAll({
      where: { groupId: +groupId },
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'email'],
        through: { attributes: ['createdAt'] } // data confirmării
      }],
      order: [['startTime', 'ASC']]
    });

    const header = 'GroupName,EventId,EventName,UserId,FirstName,LastName,Email,ConfirmedAt\n';

    const rows = events.flatMap(ev =>
      (ev.Users || []).map(u => {
        const confirmedAt = u.EventUser?.createdAt ?? '';
        return `"${group.name}",${ev.id},"${ev.name}",${u.id},"${u.firstName}","${u.lastName}","${u.email}",${confirmedAt}`;
      })
    );

    const csv = header + rows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="group_${groupId}_participants.csv"`);
    return res.status(200).send(csv);

  } catch (err) {
    next(err);
  }
});

router
  .route('/event-groups')
  .get(async (req, res, next) => {  
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
  .post(async (req, res, next) => {  
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

// id request
router
  .route('/event-groups/:id')
  .get(async (req, res, next) => {  
    try {
      const eventGroup = await EventGroup.findByPk(req.params.id);
      if (eventGroup) {
        res.status(200).json({
          message: `Event group ${eventGroup.name} found`,
          eventGroup
        });
      } else {
        res.status(404).json({ error: `Event Group with id: ${req.params.id} not found` });
      }
    } catch (err) {
      next(err);
    }
  })
  .put(async (req, res, next) => {
    try {
      const eventGroup = await EventGroup.findByPk(req.params.id);
      if (eventGroup) {
        const updatedEventGroup = await eventGroup.update(req.body);
        res.status(200).json({
          message: `Event group ${updatedEventGroup.name} updated successfully`,
          eventGroup: updatedEventGroup
        });
      } else {
        res.status(404).json({ error: `Event Group with id: ${req.params.id} not found` });
      }
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const eventGroup = await EventGroup.findByPk(req.params.id);
      if (eventGroup) {
        const name = eventGroup.name;
        await eventGroup.destroy();
        res.status(200).json({ message: `Event group ${name} deleted successfully` });
      } else {
        res.status(404).json({ error: `Event Group with id: ${req.params.id} not found` });
      }
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
