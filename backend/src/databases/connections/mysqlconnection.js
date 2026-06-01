const mysql = require("mysql2/promise") ;
const dotenv = require("dotenv") ;

dotenv.config();

// Carregando dados de acesso ao banco do arquivo .env
const config_host = process.env.DB_HOST || "localhost";
const config_user = process.env.DB_USER || "root" ;
const config_password = process.env.DB_PASSWORD || "";
const config_port = process.env.DB_PORT || 3306;
const config_database = process.env.DB_DATABASE || "mysql";
// conexao ou string connection
const pool = mysql.createPool(
    {
        host: config_host,
        user: config_user,
        password: config_password,
        port: config_port,
        database: config_database
    }
);

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexão com Banco de dados OK !');
        // Libera a conexão de volta para o pool
        connection.release();
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error.message);
    }
}        

async function testSQL(pool){
   const [result, fields] = await pool.execute('SELECT * FROM users');
   console.log( result);   
   pool.end();
}

module.exports = { pool, testConnection }
