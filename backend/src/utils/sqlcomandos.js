let sql_fields = [];
let sql_values = [];

function extrair_dados(payload){
  sql_fields = [];
  sql_values = [];
  for (let chave in payload) {  
    if (payload.hasOwnProperty(chave)) { 
      sql_fields.push( chave) ;
      sql_fields.push( " , ") ;
      sql_values.push(payload[chave]);
    }  
  }
  sql_fields.pop();
}

function gerar_sqlFields(){
  let aux = "";
  for ( var i = 0; i < sql_fields.length ; i++  ){
    aux = aux + sql_fields[i] ;  
  }
  return aux;
}

function gerar_sqlParams(){
  let aux = "";
  for ( var i = 0; i < sql_fields.length ; i++  ){
    // retira espaco em branco do elemento
    chave = sql_fields[i].replace(/\s+/g, '');
    if (  chave == ",") {
        aux = aux + sql_fields[i] ;  
    }else {
       aux = aux + " ? " ;  
  }
  
  }
  return aux;
}

function gerar_sqlSets(){
  let aux = "";
  for ( var i = 0; i < sql_fields.length ; i++  ){
    chave = sql_fields[i].replace(/\s+/g, '');
    if (  chave == ",") {
        aux = aux + sql_fields[i] ;  
    } else {
      aux = aux + sql_fields[i]+" = ? " ;  
    }
    
  }
  return aux;
}

function valuesParams(){
    return sql_values;
}
// post e put
// const local_values = valuesParams() ;
module.exports = { valuesParams, extrair_dados, gerar_sqlFields , gerar_sqlParams ,gerar_sqlSets }