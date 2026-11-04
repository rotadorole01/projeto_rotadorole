
const express = require("express");
const myController = require("../controller/categoriasController.js");

const routes = express.Router();

const endPoint = `/${myController.EndPointName()}`;

// LISTAR TODAS AS CATEGORIAS - PÚBLICO
routes.get(endPoint, async (req, res) => {
    try {
        const responseData = await myController.Get(req, res);

        return res.status(200).json(responseData);
    } catch (error) {
        console.error("Erro ao listar categorias:", error);

        return res.status(500).json({
            message: "Erro interno ao listar categorias."
        });
    }
});

// CONSULTAR CATEGORIA PELO ID - PÚBLICO
routes.get(`${endPoint}/:id`, async (req, res) => {
    try {
        const responseData = await myController.GetById(req, res);

        return res.status(200).json(responseData);
    } catch (error) {
        console.error("Erro ao consultar categoria:", error);

        return res.status(500).json({
            message: "Erro interno ao consultar categoria."
        });
    }
});

// CADASTRO, EDIÇÃO E EXCLUSÃO DE CATEGORIAS
// Temporariamente desativados por segurança.
// Os dados existentes no MySQL são preservados.

module.exports = routes;
