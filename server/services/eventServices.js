const Event = require('../models/event');
const EventUser = require('../models/eventUser');

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
            const now = new Date();

            // Închide evenimentele care au trecut de endTime
            await Event.update(
                { state: "CLOSED" },
                {
                    where: {
                        endTime: { [Op.lt]: now },
                        state: "OPEN",
                    },
                }
            );

            // Deschide evenimentele care sunt în intervalul orar (startTime <= now <= endTime)
            await Event.update(
                { state: "OPEN" },
                {
                    where: {
                        startTime: { [Op.lte]: now },
                        endTime: { [Op.gte]: now },
                        state: "CLOSED",
                    },
                }
            );

            // Închide evenimentele care nu au început încă (now < startTime)
            await Event.update(
                { state: "CLOSED" },
                {
                    where: {
                        startTime: { [Op.gt]: now },
                        state: "OPEN",
                    },
                }
            );

            const events = await Event.findAll();
            res.status(200).json({
                message: `Found ${events.length} events`,
                events
            });
        } catch (err) {
          next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const now = new Date();
            const startTime = new Date(req.body.startTime);
            const endTime = new Date(req.body.endTime);
            
            // Calculează starea corectă bazată pe ora curentă
            let calculatedState = "CLOSED";
            if (now >= startTime && now <= endTime) {
                calculatedState = "OPEN";
            }
            
            const event = await Event.create({
                ...req.body,
                state: calculatedState
            });
            res.status(201).json({
                message: `Event ${event.name} created successfully`,
                event
            });
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
            const now = new Date();

            // Actualizează stările evenimentelor înainte de filtrare
            // Închide evenimentele care au trecut de endTime
            await Event.update(
                { state: "CLOSED" },
                {
                    where: {
                        endTime: { [Op.lt]: now },
                        state: "OPEN",
                    },
                }
            );

            // Deschide evenimentele care sunt în intervalul orar
            await Event.update(
                { state: "OPEN" },
                {
                    where: {
                        startTime: { [Op.lte]: now },
                        endTime: { [Op.gte]: now },
                        state: "CLOSED",
                    },
                }
            );

            // Închide evenimentele care nu au început încă
            await Event.update(
                { state: "CLOSED" },
                {
                    where: {
                        startTime: { [Op.gt]: now },
                        state: "OPEN",
                    },
                }
            );

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
            res.status(200).json({
                message: `Found ${events.length} events matching filter`,
                events
            });
        } catch (err) {
           next(err);
        }   
});

router.post('/events/attend', async (req, res, next) => {
  try {
    const { accessCode, userId } = req.body;

    if (!accessCode || !userId) {
      return res.status(400).json({ message: 'accessCode și userId sunt obligatorii' });
    }

    // 1) găsește evenimentul după cod
    const event = await Event.findOne({ where: { accessCode } });
    if (!event) {
      return res.status(404).json({ message: 'Cod invalid sau eveniment inexistent' });
    }

    // 2) evită dublarea confirmării
    const existing = await EventUser.findOne({
      where: { eventId: event.id, userId }
    });

    if (existing) {
      return res.status(409).json({ message: 'Prezența a fost deja confirmată' });
    }

    // 3) creează prezența
    const attendance = await EventUser.create({
      eventId: event.id,
      userId
    });

    return res.status(201).json({
      message: 'Prezență confirmată!',
      confirmedAt: attendance.createdAt
    });

  } catch (err) {
    next(err);
  }
});



//id request
router
    .route('/events/:id')
    .get(async (req, res) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (event) {
                res.status(200).json({
                    message: `Event ${event.name} found`,
                    event
                });
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
                res.status(200).json({
                    message: `Event ${updatedEvent.name} updated successfully`,
                    event: updatedEvent
                });
            } else {
                res.status(404).json({ error: `Event with id: ${req.params.id} not found` })
            }
        } catch (err) {
           next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            const event = await Event.findByPk(req.params.id);
            if (!event) {
                return res.status(404).json({ error: `Event with id: ${req.params.id} not found` });
            }
            
            // Verifică dacă utilizatorul este creatorul evenimentului
            const { userId } = req.body;
            if (event.createdBy && event.createdBy !== userId) {
                return res.status(403).json({ 
                    error: 'Nu aveți permisiunea de a șterge acest eveniment. Doar creatorul poate șterge.' 
                });
            }
            
            const name = event.name;
            await event.destroy();
            res.status(200).json({
                message: `Event ${name} deleted successfully`
            });
        } catch (err) {
           next(err);
        }
    })

//simplify
router.get('/simplified-events', async (req, res) => {

    try {
        const events = await Event.findAll(
            {
                attributes: ['name' , 'state']
            });
        res.status(200).json({
            message: `Found ${events.length} simplified events`,
            events
        });
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

        const events = await Event.findAll({
            order: [[field, 'ASC']] // ASC pentru crescător, DESC pentru descrescător
        });

        res.status(200).json({
            message: `Found ${events.length} events sorted by ${field}`,
            events
        });

    } catch (err) {
        next(err);
    }
});

router.get('/events/group/:groupId', async (req, res, next) => {
  try {
    const now = new Date();
    const { groupId } = req.params;

    // Închide evenimentele care au trecut de endTime
    await Event.update(
      { state: "CLOSED" },
      {
        where: {
          groupId: +groupId,
          endTime: { [Op.lt]: now },
          state: "OPEN",
        },
      }
    );

    // Deschide evenimentele care sunt în intervalul orar (startTime <= now <= endTime)
    await Event.update(
      { state: "OPEN" },
      {
        where: {
          groupId: +groupId,
          startTime: { [Op.lte]: now },
          endTime: { [Op.gte]: now },
          state: "CLOSED",
        },
      }
    );

    // Închide evenimentele care nu au început încă (now < startTime)
    await Event.update(
      { state: "CLOSED" },
      {
        where: {
          groupId: +groupId,
          startTime: { [Op.gt]: now },
          state: "OPEN",
        },
      }
    );

    const events = await Event.findAll({ where: { groupId: +groupId } });
    res.status(200).json({ message: `Found ${events.length} events`, events });
  } catch (err) {
    next(err);
  }
});


module.exports = router



