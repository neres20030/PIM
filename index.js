const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Inicia o aplicativo Express
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conectar ao MongoDB (substitua pela sua URI de conexão MongoDB)
mongoose.connect('mongodb://localhost:27017/pragas', { useNewUrlParser: true, useUnifiedTopology: true });

// Definir o modelo para Pragas
const Pest = mongoose.model('Pest', {
  name: String,
  location: String
});

// Rota para registrar uma nova praga
app.post('/api/pragas', async (req, res) => {
  try {
    const newPest = new Pest(req.body);
    await newPest.save();
    res.status(200).send('Praga registrada com sucesso');
  } catch (err) {
    res.status(500).send('Erro ao registrar praga');
  }
});

// Rota para obter todas as pragas cadastradas
app.get('/api/pragas', async (req, res) => {
  try {
    const pests = await Pest.find();
    res.json(pests);
  } catch (err) {
    res.status(500).send('Erro ao buscar pragas');
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
