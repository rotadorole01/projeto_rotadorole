
const { db } = require("../databases/DatabaseContext.js");
const {
    valuesParams,
    extrair_dados,
    gerar_sqlFields,
    gerar_sqlParams,
    gerar_sqlSets
} = require("../utils/sqlcomandos.js");

const tableName = "parceiros";

// Listar parceiros
async function Get() {
    const sqlText = `SELECT * FROM ${tableName} ORDER BY id`;
    const [result] = await db.execute(sqlText);

    return { message: "Success", data: result };
}

// Buscar parceiro por ID
async function GetById(id) {
    const sqlText = `SELECT * FROM ${tableName} WHERE id = ?`;
    const [result] = await db.execute(sqlText, [id]);

    return { message: "Success", data: result };
}

// Cadastro original
async function Post(payload) {
    if (!payload) {
        return {
            message: "Error",
            data: "Dados não informados!"
        };
    }

    extrair_dados(payload);

    const local_fields = gerar_sqlFields();
    const local_params = gerar_sqlParams();
    const valuessql = valuesParams();

    const sqlText = `
        INSERT INTO ${tableName}
        (${local_fields})
        VALUES (${local_params})
    `;

    const [result] = await db.execute(sqlText, valuessql);

    return { message: "Success", data: result };
}

// Atualizar parceiro
async function Put(payload, id) {
    if (!payload) {
        return {
            message: "Error",
            data: "Dados não informados!"
        };
    }

    extrair_dados(payload);

    const local_Sets = gerar_sqlSets();
    const local_values = valuesParams();

    local_values.push(id);

    const sqlText = `
        UPDATE ${tableName}
        SET ${local_Sets}
        WHERE id = ?
    `;

    const [result] = await db.execute(sqlText, local_values);

    return { message: "Success", data: result };
}

// Excluir parceiro
async function Delete(id) {
    const sqlText = `DELETE FROM ${tableName} WHERE id = ?`;
    const [result] = await db.execute(sqlText, [id]);

    return { message: "Success", data: result };
}

// Verificar se o usuário já solicitou patrocínio
async function BuscarPorUsuario(usuarioId) {
    const sqlText = `
        SELECT id, id_usuario, validated
        FROM parceiros
        WHERE id_usuario = ?
        LIMIT 1
    `;

    const [result] = await db.execute(sqlText, [usuarioId]);

    return result[0] || null;
}

// Salvar uma nova solicitação de patrocínio
async function CriarSolicitacao(dados, usuarioId) {
    const sqlText = `
        INSERT INTO parceiros (
            name,
            nameempresa,
            cnpj,
            telefone,
            emailcorporativo,
            interesse,
            area,
            mensagem,
            validated,
            id_usuario
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `;

    const valores = [
        dados.responsavel,
        dados.empresaNome,
        dados.cnpj,
        dados.telefoneComercial,
        dados.emailComercial,
        dados.tipoParceria,
        dados.areaAtuacao,
        dados.mensagem,
        usuarioId
    ];

    const [result] = await db.execute(sqlText, valores);

    return result.insertId;
}

function EndPointName() {
    return tableName;
}

module.exports = {
    Get,
    GetById,
    Post,
    Put,
    Delete,
    BuscarPorUsuario,
    CriarSolicitacao,
    EndPointName
};
