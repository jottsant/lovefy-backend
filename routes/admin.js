const express = require('express');
const router = express.Router();
const db = require('../models/user');

// Exemplo de rota protegida de admin
router.get('/all-users', async (req, res) => {
  const users = await db.getAllUsers();
  res.json({ users });
});

module.exports = router;
