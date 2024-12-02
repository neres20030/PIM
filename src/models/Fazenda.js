const mongoose = require('mongoose');

const FazendaSchema = new mongoose.Schema({
    
  id:Number,
  cpfCnpj:String,
  nome:String,
  inscricaoEstadual:String,
  uf:{id:Number, nome:String},
  municipio:{id:Number, nome:String, ufId:Number},
  roteiro:String,
  latitude:String,
  longitude:String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fazendas', FazendaSchema);