// switch das rotas de parceiros
const Routes = require("express");
const myController = require("../controller/parceirosController.js");

const routes = Routes();

const endPoint = `/${myController.EndPointName()}`;

routes.get(endPoint, async (req, res) => {
   const responseData = await myController.Get(req, res);
   res.status(200).json(responseData);
});

routes.get(`${endPoint}/:id`, async (req, res) => {
   const responseData = await myController.GetById(req, res);
   res.status(200).json(responseData);
});

// async/await para aguardar o banco de dados processar
routes.post(endPoint, async (req, res) => {
   const responseData = await myController.Post(req, res);
   res.status(201).json(responseData);
});

routes.put(`${endPoint}/:id`, async (req, res) => {
    const responseData = await myController.Put(req, res);
   res.status(201).json(responseData);
});

routes.delete(`${endPoint}/:id`, async (req, res) => {
   const responseData = await myController.Delete(req, res);
   res.status(201).json(responseData);
});

module.exports = routes;