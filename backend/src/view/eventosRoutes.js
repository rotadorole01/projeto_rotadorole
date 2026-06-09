const Routes = require("express");
const myController = require("../controller/eventosControllers");

const routes = Routes();

const endPoint = `/${myController.EndPointName()}`;

// Listar todos os eventos
routes.get(endPoint, async (req, res) => {
   const responseData = await myController.Get(req, res);
   res.status(200).json(responseData);
});

// Buscar evento por ID
routes.get(`${endPoint}/:id`, async (req, res) => {
   const responseData = await myController.GetById(req, res);
   res.status(200).json(responseData);
});

// Cadastrar novo evento (Adicionado async/await)
routes.post(endPoint, async (req, res) => {
   const responseData = await myController.Post(req, res);
   res.status(201).json(responseData);
});

// Atualizar evento existente (Adicionado async/await e ajustado para status 200)
routes.put(`${endPoint}/:id`, async (req, res) => {
   const responseData = await myController.Put(req, res);
   res.status(200).json(responseData);
});

// Deletar evento (Adicionado async/await e ajustado para status 200)
routes.delete(`${endPoint}/:id`, async (req, res) => {
   const responseData = await myController.Delete(req, res);
   res.status(200).json(responseData);
});

module.exports = routes;