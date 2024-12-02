const Opcao = require('../models/Opcao');
const Municipio = require('../models/Municipio');
const Estado = require('../models/Estado');
const Fazenda = require('../models/Fazenda');
const Produtor = require('../models/Produtor');
const Frigorifico = require('../models/Frigorifico');

module.exports = {

    async store(req, res) {
        try {
            const { tipo, descricao } = req.body;

            const existe = await Opcao.findOne({ tipo, descricao });

            if (existe) {
                return res.status(400).json({ message: 'Já existe um cadastro para essa opção.' });
            }

            await Opcao.create(req.body);

            return res.status(200).json({ message: 'Opção cadastrada com sucesso!' });
        } catch (error) {
            console.error('Erro ao cadastrar opção:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    async getall(req, res) {
        try {
            const busca = req.body.busca || '';
            const tipo = req.body.tipo || '';
            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);
    
            const limitValue = parseInt(limit) || 10;  // Define um limite padrão de 10, caso não seja passado
            const pageValue = parseInt(page) || 1;  // Define a página padrão como 1
    
            let dados;
    
            if (tipo === 'municipio') {
                dados = await Municipio.find({ ufId: busca });
                return res.json(dados);
            }
    
            if (tipo === 'estado') {
                dados = await Estado.find();
                return res.json(dados);
            }
    
            if (tipo === 'fazendas') {
                // Buscar produtores que correspondem ao critério de busca
                const produtores = await Produtor.find({
                    $or: [
                        { cpfCnpj: new RegExp(busca, 'i') },
                        { responsavel: new RegExp(busca, 'i') },
                        { nome: new RegExp(busca, 'i') }
                    ]
                });
            
                // Extrair os cpfCnpj dos produtores encontrados
                const produtoresCpfCnpj = produtores.map(produtor => produtor.cpfCnpj);
            
                // Buscar fazendas associadas aos produtores encontrados
                const fazendasPorProdutor = await Fazenda.find({ cpfCnpj: { $in: produtoresCpfCnpj } });
            
                // Buscar fazendas diretamente pelos campos nome, municipio ou cpfCnpj
                const fazendasPorBusca = await Fazenda.find({
                    $or: [
                        { nome: new RegExp(busca, 'i') },
                        { 'municipio.nome': new RegExp(busca, 'i') },
                        { 'uf.nome': new RegExp(busca, 'i') },
                        { cpfCnpj: new RegExp(busca, 'i') }
                    ]
                });
            
                // Combinar fazendas associadas aos produtores e fazendas encontradas diretamente
                const fazendasUnificadas = [...fazendasPorProdutor, ...fazendasPorBusca];
            
                // Remover fazendas duplicadas (caso a mesma fazenda tenha sido encontrada pelas duas buscas)
                const fazendasFiltradas = fazendasUnificadas.filter((fazenda, index, self) =>
                    index === self.findIndex(f => f._id.toString() === fazenda._id.toString())
                );
            
                // Paginar os resultados combinados
                const paginatedFazendas = fazendasFiltradas.slice((pageValue - 1) * limitValue, pageValue * limitValue);
            
                // Mapear fazendas com seus respectivos produtores
                const dados = paginatedFazendas.map(fazenda => {
                    const produtor = produtores.find(p => p.cpfCnpj === fazenda.cpfCnpj);
                    return { ...fazenda._doc, produtor: produtor ? produtor._doc : null };
                });
            
                // Retornar os dados paginados com informações adicionais
                return res.json({
                    dados,
                    totalDocuments: fazendasFiltradas.length,
                    totalPages: Math.ceil(fazendasFiltradas.length / limitValue),
                    currentPage: pageValue
                });
            }
    
            if (tipo === 'frigorificos') {
                dados = await Frigorifico.find({
                    $or: [
                        { cpfCnpj: new RegExp(busca, 'i') },
                        { nome: new RegExp(busca, 'i') },
                        { 'municipio.nome': new RegExp(busca, 'i') },
                        { 'uf.nome': new RegExp(busca, 'i') },
                    ]
                })
                .limit(limitValue)
                .skip((pageValue - 1) * limitValue);
    
                const totalDocuments = await Frigorifico.countDocuments({
                    $or: [
                        { cpfCnpj: new RegExp(busca, 'i') },
                        { nome: new RegExp(busca, 'i') }
                    ]
                });
    
                return res.json({
                    dados,
                    totalDocuments,
                    totalPages: Math.ceil(totalDocuments / limitValue),
                    currentPage: pageValue
                });
            }
    
            // Para os demais tipos, sem paginação
            dados = tipo ? await Opcao.find({ tipo }) : await Opcao.find();
            return res.json(dados);
    
        } catch (error) {
            console.error('Erro ao buscar opções:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },    

    async delete(req, res) {
        const { _id, tipo, descricao } = req.body;

        try {
            let opcao;
            if (_id) {
                opcao = await Opcao.deleteOne({ _id });
            } else if (tipo && descricao) {
                opcao = await Opcao.deleteOne({ tipo, descricao });
            } else if (tipo) {
                opcao = await Opcao.deleteMany({ tipo });
            } else {
                return res.status(400).json({ message: 'Opção não encontrada.' });
            }

            if (!opcao || opcao.deletedCount === 0) {
                return res.status(400).json({ message: 'Opção não encontrada.' });
            }

            const message = tipo && !descricao ? 'Opções excluídas com sucesso!' : 'Opção excluída com sucesso!';
            return res.status(200).json({ message });

        } catch (error) {
            console.error('Erro ao excluir opção:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },
};
