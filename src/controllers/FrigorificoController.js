const Frigorifico = require('../models/Frigorifico');

module.exports = {

    async store(req, res) {
        try {
            const existe = await Frigorifico.findOne({ cpfCnpj: req.body.cpfCnpj });

            if (existe) {
                return res.status(400).json({ message: 'Já existe um cadastro para esse frigorifico.' });
            }

            const novoFrigorifico = await Frigorifico.create(req.body);

            if (!novoFrigorifico) {
                return res.status(500).json({ message: 'Erro ao cadastrar frigorifico.' });
            }

            return res.status(200).json({ message: 'Frigorifico cadastrado com sucesso!' });
        } catch (error) {
            console.error('Erro ao cadastrar frigorifico:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    async getall(req, res) {
        try {
            const busca = req.body.busca || '';
            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);

            let frigorificosQuery = Frigorifico.find({
                $or: [
                    { cpfCnpj: new RegExp(busca, 'i') },
                    { nome: new RegExp(busca, 'i') }
                ]
            });

            if (limit && page) {
                frigorificosQuery = frigorificosQuery.limit(limit).skip((page - 1) * limit);
            }

            const dados = await frigorificosQuery.exec();

            const totalDocuments = await Frigorifico.countDocuments({
                $or: [
                    { cpfCnpj: new RegExp(busca, 'i') },
                    { nome: new RegExp(busca, 'i') }
                ]
            });

            const totalPages = limit ? Math.ceil(totalDocuments / limit) : 1;

            return res.json({
                dados,
                totalDocuments,
                totalPages,
                currentPage: limit ? page : 1,
            });
        } catch (error) {
            console.error('Erro ao buscar frigorificos:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    async delete(req, res) {
        const { _id, cpfCnpj } = req.body;

        try {
            let frigorifico;
            if (_id) {
                frigorifico = await Frigorifico.deleteOne({ _id });
            } else if (cpfCnpj) {
                frigorifico = await Frigorifico.deleteOne({ cpfCnpj });
            } else {
                return res.status(400).json({ message: 'Frigorifico não encontrado.' });
            }

            if (!frigorifico || frigorifico.deletedCount === 0) {
                return res.status(400).json({ message: 'Frigorifico não encontrado.' });
            }

            return res.status(200).json({ message: 'Frigorifico excluído com sucesso!' });
        } catch (error) {
            console.error('Erro ao excluir frigorifico:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    async update(req, res) {
        const { _id, nome, razaoSocial, cpfCnpj, inscricaoEstadual, inscricaoMunicipal, telefone, email, uf, municipio, complemento } = req.body;

        try {
            const frigorifico = await Frigorifico.findByIdAndUpdate(
                _id,
                { nome, razaoSocial, cpfCnpj, inscricaoEstadual, inscricaoMunicipal, telefone, email, uf, municipio, complemento },
                { new: true }
            );

            if (!frigorifico) {
                return res.status(400).json({ message: 'Frigorifico não encontrado.' });
            }

            return res.status(200).json({ message: 'Frigorifico alterado com sucesso!' });
        } catch (error) {
            console.error('Erro ao atualizar frigorifico:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },
}
