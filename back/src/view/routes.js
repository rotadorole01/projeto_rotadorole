
const Routes = require("express");

const eventosRoutes = require("./eventosRoutes.js");
const locaisRoutes = require("./locaisRoutes.js");
const categoriasRoutes = require("./categoriasRoutes.js");
const parceirosRoutes = require("./parceirosRoutes.js");
const loginsRoutes = require("./loginsRoutes.js");
const usersRoutes = require("./usersRoutes.js");

const routes = Routes();

// ROTAS DO PROJETO ROTA DO ROLÊ

routes.use(eventosRoutes);
routes.use(locaisRoutes);
routes.use(categoriasRoutes);
routes.use(parceirosRoutes);
routes.use(loginsRoutes);
routes.use(usersRoutes);

// TESTE DO SERVIDOR

routes.get("/test", (req, res) => {
    return res.status(206).json({
        message: "servidor Rodando ..."
    });
});

module.exports = routes;
