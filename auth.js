const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/user');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, ref } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Preencha todos os campos.' });
    }

    const userExists = await db.getUserByEmail(email);
    if (userExists) return res.status(400).json({ message: 'Email já cadastrado.' });

    const hash = await bcrypt.hash(password, 10);
    const user = await db.createUser(name, email, hash, ref);

    res.status(201).json({ message: 'Usuário criado com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Preencha todos os campos.' });

    const user = await db.getUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Usuário ou senha inválidos.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Usuário ou senha inválidos.' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, name: user.name, email: user.email, id: user.id });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno.' });
  }
});

module.exports = router;