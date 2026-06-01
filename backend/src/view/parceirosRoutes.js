const Routes = require("express");
const myController = require("../controller/parceirosController.js");

const routes = Routes();

const endPoint = `/${myController.EndPointName()}`;

routes.get(endPoint, async (req,res)=>{
   const responseData = await myController.Get(req,res);
   res.status(200).json(responseData);
});

routes.get( `${endPoint}/:id` , async ( req,res ) => {
   const responseData = await myController.GetById(req,res);
   res.status(200).json(responseData);
}
);

routes.post(endPoint,(req,res)=>{
   const responseData = myController.Post(req,res);
   res.status(201).json(responseData);
});

routes.put(`${endPoint}/:id`,(req,res)=>{
    const responseData = myController.Put(req,res);
   res.status(201).json(responseData);
});

routes.delete(`${endPoint}/:id`,(req,res)=>{
   const responseData = myController.Delete(req,res);
   res.status(201).json(responseData);
});

module.exports = routes;