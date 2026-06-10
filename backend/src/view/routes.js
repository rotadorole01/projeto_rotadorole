// switch das rotas
const Routes = require("express");
const usersRoutes = require("./usersRoutes.js");
const eventosRoutes = require("./eventosRoutes.js");
const locaisRoutes = require("./locaisRoutes.js");
const categoriasRoutes = require("./categoriasRoutes.js");
const parceirosRoutes = require("./parceirosRoutes.js");
const loginsRoutes = require("./loginsRoutes.js");

// Importa o contexto do banco de dados para podermos fazer a consulta direta aqui
const { db } = require("../databases/DatabaseContext.js");

const routes = Routes();

routes.use( usersRoutes );
routes.use( eventosRoutes) ;
routes.use( locaisRoutes) ;
routes.use( categoriasRoutes) ;
routes.use( parceirosRoutes) ;
routes.use( loginsRoutes) ;

// --- [NOVA ROTA] ENTRADA DE DADOS PARA O CARROSSEL DA INDEX.HTML ---
routes.get("/patrocinadores", async (req, res) => {
    try {
        // Busca os patrocinadores direto na tabela do phpMyAdmin
        const sqlText = `SELECT * FROM patrocinadores_carrossel ORDER BY id`;
        const [result] = await db.execute(sqlText); 
        
        // Retorna no formato exato que a nossa index.html espera ler
        return res.status(200).json({ "success": true, "data": result });
    } catch (error) {
        console.error("Erro ao buscar patrocinadores do carrossel:", error);
        return res.status(500).json({ "success": false, "message": "Erro no banco de dados" });
    }
});

routes.get("/test", (req,res) => { 
    res.status(206).json( { "message":"servidor Rodando ..."} );
});

module.exports = routes;