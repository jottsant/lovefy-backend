const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/user');

router.post('/register', async (req, res) => {
  const { name, email, password, ref } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  const userExists = await db.getUserByEmail(email);
  if (userExists) return res.status(400).json({ message: 'Email já cadastrado.' });

  const hash = await bcrypt.hash(password, 10);
  const user = await db.createUser(name, email, hash, ref);

  res.status(201).json({ message: 'Usuário registrado com sucesso.' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.getUserByEmail(email);
  if (!user) return res.status(400).json({ message: 'Usuário não encontrado.' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Senha inválida.' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2d' });
  res.json({ token });
});

module.exports = router;
