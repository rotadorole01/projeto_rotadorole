
const { db } = require("../databases/DatabaseContext.js");

const {
  valuesParams,
  extrair_dados,
  gerar_sqlFields,
  gerar_sqlParams,
  gerar_sqlSets
} = require("../utils/sqlcomandos.js");

const tableName = "eventos";

// Campos que podem ser preenchidos no cadastro e na edição.
// O id_empresa nunca será recebido diretamente do formulário.
const camposPermitidos = [
  "titulo",
  "data",
  "local",
  "descricao",
  "foto",
  "horario",
  "categoria",
  "duracao",
  "localizacao",
  "preco",
  "ingresso",
  "cidade",
  "bairro",
  "link",
  "nome",
  "email",
  "telefone",
  "imagem"
];

function filtrarDados(payload) {
  const dados = {};

  for (const campo of camposPermitidos) {
    if (Object.prototype.hasOwnProperty.call(payload, campo)) {
      dados[campo] = payload[campo];
    }
  }

  return dados;
}

// Listar todos os eventos (público)
async function Get() {
  const sqlText = `SELECT * FROM ${tableName} ORDER BY id`;
  const [result] = await db.execute(sqlText);

  return {
    message: "Success",
    data: result
  };
}

// Buscar evento pelo ID (público)
async function GetById(id) {
  const sqlText = `SELECT * FROM ${tableName} WHERE id = ?`;
  const [result] = await db.execute(sqlText, [id]);

  return {
    message: "Success",
    data: result
  };
}

// Listar eventos pertencentes à empresa autenticada
async function GetMeusEventos(idEmpresa) {
  const sqlText = `
    SELECT *
    FROM ${tableName}
    WHERE id_empresa = ?
    ORDER BY id DESC
  `;

  const [result] = await db.execute(sqlText, [idEmpresa]);

  return {
    message: "Success",
    data: result
  };
}

// Cadastrar evento associado à empresa autenticada
async function Post(payload, idEmpresa) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      message: "Error",
      data: "Dados não informados!"
    };
  }

  const dados = filtrarDados(payload);

  // Associação definida pela API, nunca pelo navegador.
  dados.id_empresa = idEmpresa;

  extrair_dados(dados);

  const local_fields = gerar_sqlFields();
  const local_params = gerar_sqlParams();
  const valuessql = valuesParams();

  const sqlText = `
    INSERT INTO ${tableName} (${local_fields})
    VALUES (${local_params})
  `;

  const [result] = await db.execute(sqlText, valuessql);

  return {
    message: "Success",
    data: result
  };
}

// Atualizar somente eventos da própria empresa
async function Put(payload, id, idEmpresa) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      message: "Error",
      data: "Dados não informados!"
    };
  }

  const dados = filtrarDados(payload);

  if (Object.keys(dados).length === 0) {
    return {
      message: "Error",
      data: "Nenhum campo válido informado!"
    };
  }

  extrair_dados(dados);

  const local_sets = gerar_sqlSets();
  const local_values = valuesParams();

  const sqlText = `
    UPDATE ${tableName}
    SET ${local_sets}
    WHERE id = ? AND id_empresa = ?
  `;

  const [result] = await db.execute(
    sqlText,
    [...local_values, id, idEmpresa]
  );

  return {
    message: result.affectedRows > 0
      ? "Success"
      : "Evento não encontrado ou não pertence à empresa.",
    data: result
  };
}

// Excluir somente eventos da própria empresa
async function Delete(id, idEmpresa) {
  const sqlText = `
    DELETE FROM ${tableName}
    WHERE id = ? AND id_empresa = ?
  `;

  const [result] = await db.execute(sqlText, [id, idEmpresa]);

  return {
    message: result.affectedRows > 0
      ? "Success"
      : "Evento não encontrado ou não pertence à empresa.",
    data: result
  };
}

function EndPointName() {
  return tableName;
}

module.exports = {
  Get,
  GetById,
  GetMeusEventos,
  Post,
  Put,
  Delete,
  EndPointName
};
