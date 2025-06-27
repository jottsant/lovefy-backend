const express = require('express');
const router = express.Router();
const db = require('../models/user');
const jwt = require('jsonwebtoken');

// Middleware para verificar token de admin simples
function verifyAdminToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido.' });
    if (!decoded.isAdmin) return res.status(403).json({ message: 'Acesso negado.' });
    req.userId = decoded.id;
    next();
  });
}

router.get('/users', verifyAdminToken, async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erro interno.' });
  }
});

router.get('/couples', verifyAdminToken, async (req, res) => {
  try {
    const couples = await db.getAllCouples();
    res.json(couples);
  } catch (err) {
    res.status(500).json({ message: 'Erro interno.' });
  }
});

module.exports = router;