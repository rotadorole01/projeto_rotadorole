
const express = require("express");

const myController = require(
    "../controller/parceirosController.js"
);

const autenticacao = require(
    "../middleware/autenticacao.js"
);

const routes = express.Router();

const endPoint = `/${myController.EndPointName()}`;

// Consultar a própria solicitação
routes.get(
    `${endPoint}/minha-solicitacao`,
    autenticacao,
    async (req, res) => {
        try {
            const resultado = await myController.MinhaSolicitacao(
                req,
                res
            );

            return res.status(resultado.status).json(resultado.body);

        } catch (erro) {
            console.error("Erro ao consultar solicitação:", erro);

            return res.status(500).json({
                success: false,
                message: "Erro ao consultar solicitação."
            });
        }
    }
);

// Enviar solicitação de patrocínio
routes.post(
    `${endPoint}/solicitacao`,
    autenticacao,
    async (req, res) => {
        try {
            const resultado = await myController.SolicitarPatrocinio(
                req,
                res
            );

            return res.status(resultado.status).json(resultado.body);

        } catch (erro) {
            console.error("Erro ao solicitar patrocínio:", erro);

            return res.status(500).json({
                success: false,
                message: "Erro interno ao solicitar patrocínio."
            });
        }
    }
);

// Listar parceiros
routes.get(endPoint, async (req, res) => {
    try {
        const resultado = await myController.Get(req, res);

        return res.status(200).json(resultado);

    } catch (erro) {
        console.error("Erro ao listar parceiros:", erro);

        return res.status(500).json({
            message: "Erro interno ao listar parceiros."
        });
    }
});

// Consultar parceiro pelo ID
routes.get(`${endPoint}/:id`, async (req, res) => {
    try {
        const resultado = await myController.GetById(req, res);

        return res.status(200).json(resultado);

    } catch (erro) {
        console.error("Erro ao consultar parceiro:", erro);

        return res.status(500).json({
            message: "Erro interno ao consultar parceiro."
        });
    }
});

// Edição e exclusão permanecem desativadas por segurança.

module.exports = routes;
