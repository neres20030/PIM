const express = require('express');

const UsuarioController = require('./controllers/UsuarioController');
const ProdutorController = require('./controllers/ProdutorController');
const OpcaoController = require('./controllers/OpcaoController');
const FrigorificoController = require('./controllers/FrigorificoController');
const PedidoController = require('./controllers/PedidoController');

const routes = express.Router();


// Grupo de rotas para Opções
routes.post('/api/opcoes', OpcaoController.getall);
routes.post('/api/opcao', OpcaoController.store);
routes.post('/api/delete/opcao', OpcaoController.delete);

// Grupo de rotas para Frigoríficos
routes.post('/api/frigorificos', FrigorificoController.getall);
routes.post('/api/frigorifico', FrigorificoController.store);
routes.post('/api/delete/frigorifico', FrigorificoController.delete);
routes.post('/api/update/frigorifico', FrigorificoController.update);

// Grupo de rotas para Pedidos
routes.post('/api/pedidos', PedidoController.getall);
routes.post('/api/pedido', PedidoController.store);
routes.post('/api/delete/pedido', PedidoController.delete);

// Grupo de rotas para Produtores
routes.post('/api/produtores', ProdutorController.getall);
routes.post('/api/produtor', ProdutorController.store);
routes.post('/api/delete/produtor', ProdutorController.delete);
routes.post('/api/update/produtor', ProdutorController.update);

// Grupo de rotas para Usuários
routes.post('/api/usuarios', UsuarioController.getall);
routes.post('/api/usuario', UsuarioController.store);
routes.post('/api/login', UsuarioController.login);

// Rotas para a raiz da API
routes.get('/api', (req, res) => {
  res.send('Bem vindo à API.');
});

routes.get('/', (req, res) => {
  res.send('Bem vindo à API.');
});

module.exports = routes;
