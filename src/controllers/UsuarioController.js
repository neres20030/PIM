const Usuario = require('../models/Usuario');

function removerCaracteresPares(str) {
    let novaStr = '';
    for (let i = 0; i < str.length; i++) {
        if (i % 2 === 0) {
            novaStr += str[i];
        }
    }
    return novaStr;
}

function tratarSenha(senha) {
    return Buffer.from(removerCaracteresPares(Buffer.from(senha, 'base64').toString('ascii'))).toString('base64');
}

module.exports = {
    async store(req, res) {
        try {
            const { nome, senha } = req.body;

            if (!nome || !senha) {
                return res.status(400).json({ message: 'Nome e senha são obrigatórios.' });
            }

            let usuario = await Usuario.findOne({ nome });

            const senhaTratada = tratarSenha(senha);

            if (!usuario) {
                usuario = await Usuario.create({ nome, senha: senhaTratada });
            } else {
                return res.status(400).json({ message: 'Usuário já existe.' });
            }

            return res.status(200).json({ message: 'Usuário cadastrado com sucesso!', usuario });
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    async getall(req, res) {
        try {
            let usuarios = await Usuario.find().select('nome');

            return res.status(200).json(usuarios);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    },

    async login(req, res) {
        try {
            const { nome, senha } = req.body;

            if (!nome || !senha) {
                return res.status(400).json({ message: 'Nome e senha são obrigatórios.' });
            }

            let usuario = await Usuario.findOne({ nome });

            if (!usuario) {
                return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
            }

            const senhaTratada = tratarSenha(senha);

            if (senhaTratada !== usuario.senha) {
                return res.status(400).json({ message: 'Usuário ou senha inválidos.' });
            }

            return res.status(200).json({
                nome: usuario.nome,
                permissoes: usuario.permissoes,
                perfil: usuario.perfil
            });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
};
