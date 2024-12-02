const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Criar o app Express
const app = express();

// Configurar o body-parser para aceitar JSON
app.use(bodyParser.json());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/controleVendas', { useNewUrlParser: true, useUnifiedTopology: true });

// Criar o esquema para as Frutas e Pragas
const frutaSchema = new mongoose.Schema({
    nome: String
});

const pragaSchema = new mongoose.Schema({
    nome: String
});

// Criar os modelos
const Fruta = mongoose.model('Fruta', frutaSchema);
const Praga = mongoose.model('Praga', pragaSchema);

// Rota para cadastrar frutas
app.post('/cadastrar-fruta', async (req, res) => {
    try {
        const novaFruta = new Fruta({ nome: req.body.nome });
        await novaFruta.save();
        res.status(201).send('Fruta cadastrada com sucesso');
    } catch (error) {
        res.status(500).send('Erro ao cadastrar fruta: ' + error.message);
    }
});

// Rota para cadastrar pragas
app.post('/cadastrar-praga', async (req, res) => {
    try {
        const novaPraga = new Praga({ nome: req.body.nome });
        await novaPraga.save();
        res.status(201).send('Praga cadastrada com sucesso');
    } catch (error) {
        res.status(500).send('Erro ao cadastrar praga: ' + error.message);
    }
});

// Rota para pegar todas as frutas cadastradas
app.get('/frutas', async (req, res) => {
    try {
        const frutas = await Fruta.find();
        res.json(frutas);
    } catch (error) {
        res.status(500).send('Erro ao buscar frutas: ' + error.message);
    }
});

// Rota para pegar todas as pragas cadastradas
app.get('/pragas', async (req, res) => {
    try {
        const pragas = await Praga.find();
        res.json(pragas);
    } catch (error) {
        res.status(500).send('Erro ao buscar pragas: ' + error.message);
    }
});

// Configurar a porta do servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
