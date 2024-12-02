const mongoose = require('mongoose');

const EstadoSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    sigla:String,
    nome:String,
    regiao:String
});

module.exports = mongoose.model('Estado', EstadoSchema);