const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nome:String,
    senha:String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuarios', UsuarioSchema);