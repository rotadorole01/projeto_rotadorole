const { db } = require("../databases/DatabaseContext.js");
const { valuesParams, extrair_dados,  gerar_sqlFields ,
   gerar_sqlParams, gerar_sqlSets } = require( "../utils/sqlcomandos.js")

// nome da tabela = nome do endpoint   
const tableName = 'parceiros';

// selecionar todos os parceiros 
async function Get(){
  const sqlText = `SELECT * FROM ${tableName} ORDER BY id`;
  const [result, fields] = await db.execute(sqlText); 
  return {"success": true, "message": "Success", "data": result } 
}

// selecionar um registro pelo id
async function GetById( id ){
  const sqlText = `SELECT * FROM  ${tableName} WHERE id = ? ORDER BY id`;
  const [result, fields] = await db.execute(sqlText,[id]); 
  return {"success": true, "message": "Success", "data": result } 
}

async function Post(payload){
  // instrução sql para envio ao banco
  if ( !payload)   return {"success": false, "message": "Error", "data": "Dados não informados!" }
  extrair_dados(payload);
  const local_fields = gerar_sqlFields();
  const local_params = gerar_sqlParams() ;  
  const valuessql = valuesParams();
  const sqlText = `INSERT INTO  ${tableName} ( ${local_fields} ) VALUES ( ${local_params} )`;  
  
  // executa a consulta no banco de dados
  const [result, fields] = await db.execute( sqlText, valuessql );
  
  // Adicionado "success": true e corrigida a grafia de "Success"
  return {"success": true, "message": "Success", "data": result }
}

async function Put(payload, id){
  if ( !payload)   return {"success": false, "message": "Error", "data": "Dados não informados!" }
  extrair_dados(payload);
  const local_Sets = gerar_sqlSets(); 
  const local_values = valuesParams() ;
  const sqlText = `UPDATE  ${tableName} SET ${local_Sets} WHERE id = ?`;
  
  local_values.push( id );
  const [result, fields] = await db.execute( sqlText, local_values );
  
  // Adicionado "success": true e corrigida a grafia de "Success"
  return {"success": true, "message": "Success", "data": result }
}

// excluir um registro pelo id
async function Delete( id ){
  const sqlText = `DELETE FROM  ${tableName} WHERE id = ?`;
  const [result, fields] = await db.execute(sqlText,[id]); 
  
  // Adicionado "success": true para o frontend saber que a exclusão foi concluída
  return {"success": true, "message": "Success", "data": result } 
}

function EndPointName(){
  return tableName;
}

module.exports = { Get, GetById, Post, Put, Delete, EndPointName}