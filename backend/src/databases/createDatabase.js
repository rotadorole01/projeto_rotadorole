import { pool } from "./connectionMysql";

export async function createDb(){
    try {
        const [results, fields] = await pool.execute(
            'CREATE TABLE `municipios` ( id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, municipio VARCHAR(60) )'
        );    
    } catch (error) {
        
    }
    
}