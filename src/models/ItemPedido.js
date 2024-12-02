const mongoose = require('mongoose');

const ItemPedidoSchema = new mongoose.Schema({
    pedido:String,
    tipoDeGado:String,
    quantidade:Number,
    valor:Number
});

module.exports = mongoose.model('ItensPedidos', ItemPedidoSchema);