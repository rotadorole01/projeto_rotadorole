
class DatabaseSchemaSqlite {
    static async initialize(dbStrategy) {
        console.log("Verificando estrutura do banco de dados...");
        
        const queries = [
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                login TEXT NOT NULL,
                password TEXT NOT NULL
            )`,

            `CREATE TABLE IF NOT EXISTS estados (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                estado TEXT NOT NULL,
                regiao TEXT NULL,
                uf TEXT NOT NULL
            )`,
            
            `CREATE TABLE IF NOT EXISTS municipios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                municipio TEXT NOT NULL,
                uf TEXT NOT NULL,
                populacao INTEGER
            )`,

            `CREATE TABLE IF NOT EXISTS bairros (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                bairro TEXT NOT NULL,
                regiao TEXT NOT NULL
            )`,

             `CREATE TABLE IF NOT EXISTS dependencias (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                dependencia TEXT NOT NULL,
                capacidade TEXT NOT NULL
            )`,

           `CREATE TABLE IF NOT EXISTS alunos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                telefone TEXT NOT NULL
            )`,

            `CREATE TABLE IF NOT EXISTS cursos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                curso TEXT NOT NULL,
                duracao TEXT NOT NULL
            )`,

            `CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                cpf TEXT NOT NULL
            )`,

            `CREATE TABLE IF NOT EXISTS logradouros (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                logradouro TEXT NOT NULL,
                tipo TEXT NOT NULL
            )`,

            `CREATE TABLE IF NOT EXISTS docentes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                telefone TEXT NOT NULL
            )`,

            `CREATE TABLE IF NOT EXISTS funcionarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                dependente TEXT NOT NULL
            )`,

           `CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                estado TEXT NOT NULL,
                preco TEXT NOT NULL
            )`, 
            
            `CREATE TABLE IF NOT EXISTS disciplinas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                sigla TEXT NOT NULL
            )`,  

        ];

        for (const query of queries) {
            await dbStrategy.execute(query);
        }
    }
}

module.exports = {DatabaseSchemaSqlite }