const sqlite3 = require('sqlite3');
const {open} = require('sqlite') ;

// Esta função abre a conexão com o arquivo local 'database.db'
const getDbConnection = async () => {
    return open({
        filename: './database.db', // O arquivo será criado na raiz do projeto
        driver: sqlite3.Database
    });
};

module.exports = {getDbConnection} ;