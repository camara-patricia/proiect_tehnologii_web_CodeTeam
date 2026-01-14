const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

// Endpoint pentru autentificare:
// validează datele de login, verifică existența utilizatorului,
// compară parola introdusă cu hash-ul din baza de date
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email și parola sunt obligatorii' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credențiale invalide' });

    // In DB, campul este "password" si va contine HASH
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Credențiale invalide' });

    return res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      eventPlanner: user.eventPlanner,
    });
  } catch (err) {
    next(err);
  }
});

// Endpoint pentru înregistrarea unui utilizator nou:
// validează datele primite, verifică unicitatea emailului,
// criptează parola și salvează utilizatorul în baza de date
router.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, eventPlanner } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Date incomplete' });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email deja folosit' });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,              
      eventPlanner: !!eventPlanner,
    });

    return res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      eventPlanner: user.eventPlanner,
    });
  } catch (err) {
    next(err);
  }
});

// Endpoint pentru delogare - răspunde clientului cu un mesaj de confirmare
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

module.exports = router;
