const sqlite3 = require ('sqlite3');
const { open } = require('sqlite');

const dotenv = require("dotenv") ;

dotenv.config();
// Carregando dados de acesso ao banco do arquivo .env
const config_database = process.env.DB_DATABASE || "database";

// Esta função abre a conexão com o arquivo local 'database.db'
const getDbConnection = async () => {
    return open({
        filename: `./${config_database}.db`, // O arquivo será criado na raiz do projeto
        driver: sqlite3.Database
    });
};

module.exports = {getDbConnection}