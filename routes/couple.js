const express = require('express');
const router = express.Router();
const db = require('../models/user');

// Simulação do formulário de casal
router.post('/form', async (req, res) => {
  const { userId, names, story, date } = req.body;
  // Aqui você pode salvar os dados em outra tabela no futuro
  console.log('Novo casal:', { userId, names, story, date });
  res.json({ message: 'Dados do casal recebidos!' });
});

module.exports = router;
