
const express = require("express");
const myController = require("../controller/eventosControllers.js");
const autenticacao = require("../middleware/autenticacao.js");

const routes = express.Router();

const endPoint = `/${myController.EndPointName()}`;

// Tratamento de erros das rotas
function tratarErro(res, error, operacao) {
  console.error(`Erro ao ${operacao}:`, error);

  const status = error.status || 500;

  return res.status(status).json({
    message: status === 500
      ? `Erro interno ao ${operacao}.`
      : error.message
  });
}

// Listar todos os eventos (público)
routes.get(endPoint, async (req, res) => {
  try {
    const responseData = await myController.Get(req, res);
    return res.status(200).json(responseData);
  } catch (error) {
    return tratarErro(res, error, "listar eventos");
  }
});

// Listar somente os eventos da empresa autenticada
// IMPORTANTE: esta rota precisa vir antes de /eventos/:id
routes.get(`${endPoint}/meus`, autenticacao, async (req, res) => {
  try {
    const responseData = await myController.GetMeusEventos(req, res);
    return res.status(200).json(responseData);
  } catch (error) {
    return tratarErro(res, error, "listar meus eventos");
  }
});

// Consultar um evento pelo ID (público)
routes.get(`${endPoint}/:id`, async (req, res) => {
  try {
    const responseData = await myController.GetById(req, res);
    return res.status(200).json(responseData);
  } catch (error) {
    return tratarErro(res, error, "consultar evento");
  }
});

// Cadastrar evento - somente Empresa/CNPJ autenticada
routes.post(endPoint, autenticacao, async (req, res) => {
  try {
    const responseData = await myController.Post(req, res);

    if (responseData.message === "Error") {
      return res.status(400).json(responseData);
    }

    return res.status(201).json(responseData);
  } catch (error) {
    return tratarErro(res, error, "cadastrar evento");
  }
});

// Editar evento - somente a empresa proprietária
routes.put(`${endPoint}/:id`, autenticacao, async (req, res) => {
  try {
    const responseData = await myController.Put(req, res);

    if (responseData.message === "Error") {
      return res.status(400).json(responseData);
    }

    if (responseData.data.affectedRows === 0) {
      return res.status(404).json({
        message: "Evento não encontrado ou não pertence à sua empresa."
      });
    }

    return res.status(200).json(responseData);
  } catch (error) {
    return tratarErro(res, error, "atualizar evento");
  }
});

// Excluir evento - somente a empresa proprietária
routes.delete(`${endPoint}/:id`, autenticacao, async (req, res) => {
  try {
    const responseData = await myController.Delete(req, res);

    if (responseData.data.affectedRows === 0) {
      return res.status(404).json({
        message: "Evento não encontrado ou não pertence à sua empresa."
      });
    }

    return res.status(200).json(responseData);
  } catch (error) {
    return tratarErro(res, error, "excluir evento");
  }
});

module.exports = routes;
