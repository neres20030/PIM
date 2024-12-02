const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    id:Number,
    fazenda:String,
    frigorifico:String,
    dataPedido:Date,
    dataEmbarque:Date,
    dataAbate:Date,
    dataPagamento:Date,
    formaPagamento:String,
    valorTotal:Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedidos', PedidoSchema);