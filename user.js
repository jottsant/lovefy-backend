const express = require('express');
const router = express.Router();
const db = require('../models/user');
const jwt = require('jsonwebtoken');

// Middleware para verificar token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido.' });
    req.userId = decoded.id;
    next();
  });
}

router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const user = await db.getUserById(req.userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    // Buscar indicações
    const indicados = await db.getUsersByReferral(user.codigo_indicacao);

    res.json({
      name: user.name,
      email: user.email,
      indicados
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno.' });
  }
});

module.exports = router;