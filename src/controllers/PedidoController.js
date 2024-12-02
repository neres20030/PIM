const Pedido = require('../models/Pedido');
const Fazenda = require('../models/Fazenda');

module.exports = {

    async store(req, res) {
        try {
            const { id, itens } = req.body;

            const existe = await Pedido.findOne({ id });

            if (existe) {
                return res.status(400).json({ message: 'Já existe um cadastro para esse pedido.' });
            }

            // Verifica se há itens antes de criar
            if (itens && itens.length > 0) {
                await Promise.all(itens.map(async (item) => {
                    await Fazenda.create({ pedido: id, ...item });
                }));
            }

            const novoPedido = await Pedido.create(req.body);

            if (!novoPedido) {
                return res.status(500).json({ message: 'Erro ao cadastrar pedido.' });
            }

            return res.status(200).json({ message: 'Pedido cadastrado com sucesso!' });
        } catch (error) {
            console.error('Erro ao cadastrar pedido:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    async getall(req, res) {
        try {
            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);

            let pedidosQuery = Pedido.find();

            if (limit && page) {
                pedidosQuery = pedidosQuery.limit(limit).skip((page - 1) * limit);
            }

            const dados = await pedidosQuery.exec();

            const totalDocuments = await Pedido.countDocuments();
            const totalPages = limit ? Math.ceil(totalDocuments / limit) : 1;

            return res.json({
                dados,
                totalDocuments,
                totalPages,
                currentPage: limit ? page : 1,
            });
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    async delete(req, res) {
        const { _id, id } = req.body;

        try {
            let pedido;
            if (_id) {
                pedido = await Pedido.deleteOne({ _id });
            } else if (id) {
                pedido = await Pedido.deleteOne({ id });
            } else {
                return res.status(400).json({ message: 'Pedido não encontrado.' });
            }

            if (!pedido || pedido.deletedCount === 0) {
                return res.status(400).json({ message: 'Pedido não encontrado.' });
            }

            return res.status(200).json({ message: 'Pedido excluído com sucesso!' });
        } catch (error) {
            console.error('Erro ao excluir pedido:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

}