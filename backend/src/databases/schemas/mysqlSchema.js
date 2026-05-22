
class DatabaseSchemaMysql {
    static async initialize(dbStrategy) {
        console.log("Verificando estrutura do banco de dados...");
        
        const queries = [
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                name TEXT NOT NULL,
                login TEXT NOT NULL,
                password TEXT NOT NULL
            )`,

            `CREATE TABLE IF NOT EXISTS contatos (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                nome TEXT NOT NULL,
                apelido TEXT NULL,
                telefone TEXT NOT NULL,
                email TEXT NULL,
                endreco TEXT NULL,
                foto TEXT NULL
            )`,

        ];

        for (const query of queries) {
            await dbStrategy.execute(query);
        }
    }
}

module.exports = { DatabaseSchemaMysql }