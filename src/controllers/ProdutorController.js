const Produtor = require('../models/Produtor');
const Fazenda = require('../models/Fazenda');

module.exports = {
    async store(req, res) {
        try {
            const { nome, razaoSocial, responsavel, cpfCnpj, telefone, email, imposto, banco, agencia, conta, tipoPix, pix, fazendas } = req.body;

            const existe = await Produtor.findOne({ cpfCnpj });

            if (existe) {
                return res.status(400).json({ message: 'Já existe um cadastro para esse produtor.' });
            }

            const novoProdutor = await Produtor.create({ nome, razaoSocial, responsavel, cpfCnpj, telefone, email, imposto, banco, agencia, conta, tipoPix, pix });

            if (!novoProdutor) {
                return res.status(500).json({ message: 'Erro ao cadastrar produtor.' });
            }

            if (fazendas && fazendas.length > 0) {
                await Promise.all(fazendas.map(async (fazenda) => {
                    await Fazenda.create({
                        cpfCnpj: cpfCnpj,
                        nome: fazenda.nome,
                        inscricaoEstadual: fazenda.inscricaoEstadual,
                        municipio: fazenda.municipio,
                        uf: fazenda.uf,
                        roteiro: fazenda.roteiro,
                        latitude: fazenda.latitude,
                        longitude: fazenda.longitude
                    });
                }));
            }

            return res.status(200).json({ message: 'Produtor cadastrado com sucesso!' });
        } catch (error) {
            console.error('Erro ao cadastrar produtor:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    async getall(req, res) {
        try {
            const busca = req.body.busca || '';
            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);

            let produtoresQuery = Produtor.find({
                $or: [
                    { cpfCnpj: new RegExp(busca, 'i') },
                    { responsavel: new RegExp(busca, 'i') },
                    { nome: new RegExp(busca, 'i') }
                ]
            });

            if (limit && page) {
                produtoresQuery = produtoresQuery.limit(limit).skip((page - 1) * limit);
            }

            const produtores = await produtoresQuery.exec();
            const fazendas = await Fazenda.find();

            const totalDocuments = await Produtor.countDocuments({
                $or: [
                    { cpfCnpj: new RegExp(busca, 'i') },
                    { responsavel: new RegExp(busca, 'i') },
                    { nome: new RegExp(busca, 'i') }
                ]
            });

            const totalPages = limit ? Math.ceil(totalDocuments / limit) : 1;

            const dados = produtores.map(produtor => ({
                ...produtor._doc,
                fazendas: fazendas.filter(fazenda => fazenda.cpfCnpj === produtor.cpfCnpj)
            }));

            return res.json({
                dados,
                totalDocuments,
                totalPages,
                currentPage: limit ? page : 1,
            });
        } catch (error) {
            console.error('Erro ao buscar produtores:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    async delete(req, res) {
        const { cpfCnpj } = req.body;

        try {
            await Fazenda.deleteMany({ cpfCnpj });
            const produtorDeleteResult = await Produtor.deleteMany({ cpfCnpj });

            if (produtorDeleteResult.deletedCount === 0) {
                return res.status(400).json({ message: 'Produtor não encontrado.' });
            }

            return res.status(200).json({ message: 'Produtor excluído com sucesso!' });
        } catch (error) {
            console.error('Erro ao excluir produtor:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    async update(req, res) {
        const { _id, nome, razaoSocial, responsavel, cpfCnpj, telefone, email, imposto, banco, agencia, conta, tipoPix, pix, fazendas } = req.body;

        try {
            const produtor = await Produtor.findByIdAndUpdate(_id, { nome, razaoSocial, responsavel, cpfCnpj, telefone, email, imposto, banco, agencia, conta, tipoPix, pix }, { new: true });

            if (!produtor) {
                return res.status(400).json({ message: 'Produtor não encontrado.' });
            }

            const fazendasAntigas = fazendas.filter(fazenda => fazenda._id);
            const fazendasNovas = fazendas.filter(fazenda => !fazenda._id);

            await Promise.all(fazendasAntigas.map(async (fazenda) => {
                await Fazenda.findByIdAndUpdate(fazenda._id, {
                    cpfCnpj: fazenda.cpfCnpj,
                    nome: fazenda.nome,
                    inscricaoEstadual: fazenda.inscricaoEstadual,
                    municipio: fazenda.municipio,
                    uf: fazenda.uf,
                    roteiro: fazenda.roteiro,
                    latitude: fazenda.latitude,
                    longitude: fazenda.longitude
                });
            }));

            if (fazendasNovas && fazendasNovas.length > 0) {
                await Promise.all(fazendasNovas.map(async (fazenda) => {
                    await Fazenda.create({
                        cpfCnpj: cpfCnpj,
                        nome: fazenda.nome,
                        inscricaoEstadual: fazenda.inscricaoEstadual,
                        municipio: fazenda.municipio,
                        uf: fazenda.uf,
                        roteiro: fazenda.roteiro,
                        latitude: fazenda.latitude,
                        longitude: fazenda.longitude
                    });
                }));
            }

            return res.status(200).json({ message: 'Produtor alterado com sucesso!' });
        } catch (error) {
            console.error('Erro ao atualizar produtor:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },
}
