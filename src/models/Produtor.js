const mongoose = require('mongoose');

const ProdutorSchema = new mongoose.Schema({
    nome:String,
    razaoSocial:String,
    responsavel:String,
    cpfCnpj:String,
    telefone:String,
    email:String,
    imposto:String,
    banco:String,
    agencia:String,
    conta:String,
    tipoPix:String,
    pix:String,
    qtdAbates:Number,
    ultAbate:Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Produtores', ProdutorSchema);