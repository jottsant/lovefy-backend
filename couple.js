const express = require('express');
const router = express.Router();
const db = require('../models/user');
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido.' });
    req.userId = decoded.id;
    next();
  });
}

router.post('/create', verifyToken, async (req, res) => {
  try {
    const { coupleName, eventDate, phrase, color, extra } = req.body;
    if (!coupleName || !eventDate) return res.status(400).json({ message: 'Campos obrigatórios faltando.' });

    const result = await db.createCouple(req.userId, coupleName, eventDate, phrase, color, extra);
    res.json({ message: 'Site do casal criado.', siteId: result.lastID });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno.' });
  }
});

module.exports = router;