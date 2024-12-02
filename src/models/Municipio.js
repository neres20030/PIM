const mongoose = require('mongoose');

const MunicipioSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    nome: String,
    ufId: Number
});


module.exports = mongoose.model('Municipio', MunicipioSchema);