
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
                link TEXT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL,
                telefone VARCHAR(20) NOT NULL,
                descricao TEXT NOT NULL,
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
                name VARCHAR(120) NOT NULL,
                email VARCHAR(254) NOT NULL,
                password VARCHAR(255) NOT NULL,
                telefone VARCHAR(20) NULL,
                cidade VARCHAR(120) NULL,
                foto_perfil VARCHAR(255) NULL,
                tipo_conta VARCHAR(20) NOT NULL DEFAULT 'usuario',
                cnpj VARCHAR(14) NULL,
                nome_empresa VARCHAR(150) NULL,
                validated BIT NOT NULL DEFAULT(0),
                UNIQUE KEY uq_logins_email (email)
            )`

        ];

        for (const query of queries) {
            await dbStrategy.execute(query);
        }

        // Atualiza instalações antigas sem apagar contas ou outros dados.
        const [columns] = await dbStrategy.execute(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'logins'`
        );
        const existing = new Set(columns.map(column => column.COLUMN_NAME));
        const missingColumns = {
            telefone: 'VARCHAR(20) NULL',
            cidade: 'VARCHAR(120) NULL',
            foto_perfil: 'VARCHAR(255) NULL',
            tipo_conta: `VARCHAR(20) NOT NULL DEFAULT 'usuario'`,
            cnpj: 'VARCHAR(14) NULL',
            nome_empresa: 'VARCHAR(150) NULL',
            validated: 'BIT NOT NULL DEFAULT(0)'
        };

        for (const [name, definition] of Object.entries(missingColumns)) {
            if (!existing.has(name)) {
                await dbStrategy.execute(
                    `ALTER TABLE logins ADD COLUMN ${name} ${definition}`
                );
            }
        }
    }
}

module.exports = { DatabaseSchemaMysql }