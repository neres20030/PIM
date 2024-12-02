const mongoose = require('mongoose');

const OpcaoSchema = new mongoose.Schema({
    tipo:String,
    descricao:String,
    valor:String
});

module.exports = mongoose.model('Opcoes', OpcaoSchema);