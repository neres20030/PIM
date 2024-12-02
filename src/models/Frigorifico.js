const mongoose = require('mongoose');

const FrigorificoSchema = new mongoose.Schema({
    nome:String,
    razaoSocial:String,
    cpfCnpj:String,
    inscricaoEstadual:String,
    inscricaoMunicipal:String,
    telefone:String,
    email:String,
    uf:{id:Number, nome:String},
    municipio:{id:Number, nome:String, ufId:Number},
    complemento:String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Frigorificos', FrigorificoSchema);