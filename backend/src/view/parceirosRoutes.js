
const express = require("express");
const myController = require("../controller/parceirosController.js");

const routes = express.Router();

const endPoint = `/${myController.EndPointName()}`;

// LISTAR TODOS OS PARCEIROS - PÚBLICO
routes.get(endPoint, async (req, res) => {
    try {
        const responseData = await myController.Get(req, res);

        return res.status(200).json(responseData);
    } catch (error) {
        console.error("Erro ao listar parceiros:", error);

        return res.status(500).json({
            message: "Erro interno ao listar parceiros."
        });
    }
});

// CONSULTAR PARCEIRO PELO ID - PÚBLICO
routes.get(`${endPoint}/:id`, async (req, res) => {
    try {
        const responseData = await myController.GetById(req, res);

        return res.status(200).json(responseData);
    } catch (error) {
        console.error("Erro ao consultar parceiro:", error);

        return res.status(500).json({
            message: "Erro interno ao consultar parceiro."
        });
    }
});

// CADASTRO, EDIÇÃO E EXCLUSÃO DE PARCEIROS
// Temporariamente desativados por segurança.
// Os registros existentes no MySQL são preservados.

module.exports = routes;
