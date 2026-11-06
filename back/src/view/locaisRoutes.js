
const express = require("express");
const myController = require("../controller/locaisControllers.js");

const routes = express.Router();

const endPoint = `/${myController.EndPointName()}`;

// LISTAR TODOS OS LOCAIS - PÚBLICO
routes.get(endPoint, async (req, res) => {
    try {
        const responseData = await myController.Get(req, res);

        return res.status(200).json(responseData);
    } catch (error) {
        console.error("Erro ao listar locais:", error);

        return res.status(500).json({
            message: "Erro interno ao listar locais."
        });
    }
});

// CONSULTAR LOCAL PELO ID - PÚBLICO
routes.get(`${endPoint}/:id`, async (req, res) => {
    try {
        const responseData = await myController.GetById(req, res);

        return res.status(200).json(responseData);
    } catch (error) {
        console.error("Erro ao consultar local:", error);

        return res.status(500).json({
            message: "Erro interno ao consultar local."
        });
    }
});

// CADASTRO, EDIÇÃO E EXCLUSÃO DE LOCAIS
// Temporariamente desativados por segurança.
// Poderão ser habilitados futuramente com autorização adequada.

module.exports = routes;
