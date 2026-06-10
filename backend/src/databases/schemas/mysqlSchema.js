
class DatabaseSchemaMysql {
    static async initialize(dbStrategy) {
        console.log("Verificando estrutura do banco de dados...");
        
        const queries = [
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                name TEXT NOT NULL,
                login TEXT NOT NULL,
                password TEXT NOT NULL,
                validated BIT NOT NULL DEFAULT(0)
            )`,

            `CREATE TABLE IF NOT EXISTS eventos (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                titulo TEXT NOT NULL,
                horario TIME NOT NULL,
                data DATETIME NOT NULL,
                categoria TEXT NOT NULL,
                duracao INT,
                localizacao TEXT NOT NULL,
                preco INT,
                ingresso TEXT ,
                cidade TEXT NOT NULL,
                bairro TEXT NOT NULL,
                descricao TEXT NOT NULL,
                link TEXT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL,
                telefone VARCHAR(20) NOT NULL,
                imagem TEXT NULL
            )`,

            `CREATE TABLE IF NOT EXISTS categorias (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                categoria TEXT NOT NULL
            )`,

            `CREATE TABLE IF NOT EXISTS locais (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                localnome TEXT NOT NULL,
                endereco TEXT NOT NULL
            )`,

             `CREATE TABLE IF NOT EXISTS parceiros (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                name TEXT NOT NULL,
                nameempresa TEXT NOT NULL,
                cnpj VARCHAR(20) NOT NULL,
                telefone VARCHAR(15) NOT NULL,
                emailcorporativo TEXT NOT NULL,
                interesse TEXT NOT NULL,
                area TEXT NOT NULL,
                mensagem TEXT,
                validated BIT NOT NULL DEFAULT(0)
            )`,

               `CREATE TABLE IF NOT EXISTS logins (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                password TEXT NOT NULL,
                validated BIT NOT NULL DEFAULT(0)
            )`,

            `CREATE TABLE IF NOT EXISTS patrocinadores_carrossel (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                titulo TEXT NOT NULL,
                descricao TEXT NOT NULL,
                imagem TEXT NOT NULL
            )`

        ];

        for (const query of queries) {
            await dbStrategy.execute(query);
        }
    }
}

module.exports = { DatabaseSchemaMysql }