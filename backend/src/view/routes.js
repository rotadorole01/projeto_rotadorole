// switch das rotas
const Routes = require("express");
const usersRoutes = require("./usersRoutes.js");
const eventosRoutes = require("./eventosRoutes.js")
const locaisRoutes = require("./locaisRoutes.js")
const categoriasRoutes = require("./categoriasRoutes.js")
const parceirosRoutes = require("./parceirosRoutes.js")
const loginsRoutes = require("./loginsRoutes.js")

const routes = Routes() ;

routes.use( usersRoutes );
routes.use( eventosRoutes) ;
routes.use( locaisRoutes) ;
routes.use( categoriasRoutes) ;
routes.use( parceirosRoutes) ;
routes.use( loginsRoutes) ;


routes.get("/test", (req,res) => { 
    //codigo
    res.status(206).json( { "message":"servidor Rodando ..."} );

} );

module.exports = routes;