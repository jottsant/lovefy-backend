const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../models/user');

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Token ausente.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido.' });
  }
}

router.get('/dashboard', auth, async (req, res) => {
  const user = await db.getUserById(req.userId);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

  res.json({ user });
});

module.exports = router;
