const {pool} = require("./connectionMysql.js");
const {getDbConnection}  = require("./connectionSqllite.js"); // Função que criamos antes
const {MySQLStrategy, SQLiteStrategy } = require("./DatabaseStrategy.js");
const { DatabaseSchemaMysql } = require("./schemas/mysqlSchema.js");
const { DatabaseSchemaSqlite } = require("./schemas/sqliteSchema.js")

class DatabaseContext {
    constructor() {
        this.strategy = null;
    }

    async init() {
        // podemos utilizar um switch case
        if (process.env.DB_TYPE === 'sqlite') {
            
            const db = await getDbConnection();
            this.strategy = new SQLiteStrategy(db);
            
            // Chama a classe de schema passando a estratégia atual
            await DatabaseSchemaSqlite.initialize(this.strategy);
            
            console.log("Conectado com sucesso ao sqlite.");

        } else {
            //
            this.strategy = new MySQLStrategy(pool);
            // Chama a classe de schema passando a estratégia atual
            await DatabaseSchemaMysql.initialize(this.strategy);

            console.log("Conectado com sucesso ao MySQL.");
        }
    }
  
    async execute(query, params) {
     
        return await this.strategy.execute(query, params);
     
    }
}

const db = new DatabaseContext();

module.exports =  { db } ;



