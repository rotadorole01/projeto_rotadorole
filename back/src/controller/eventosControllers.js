
const myModel = require("../model/eventosModel.js");
const loginsModel = require("../model/loginsModel.js");

// Verifica se o usuário autenticado possui conta Empresa/CNPJ
async function verificarEmpresa(req) {
  const usuarioId = req.usuarioId;

  if (!Number.isSafeInteger(usuarioId) || usuarioId < 1) {
    const erro = new Error("Usuário não autenticado.");
    erro.status = 401;
    throw erro;
  }

  const usuario = await loginsModel.GetById(usuarioId);

  if (!usuario) {
    const erro = new Error("Conta não encontrada.");
    erro.status = 401;
    throw erro;
  }

  if (usuario.tipo_conta !== "cnpj") {
    const erro = new Error(
      "Esta funcionalidade é exclusiva para contas Empresa/CNPJ."
    );
    erro.status = 403;
    throw erro;
  }

  return usuario.id;
}

// Listar todos os eventos (público)
async function Get(req, res) {
  const responseData = await myModel.Get();
  return responseData;
}

// Buscar evento pelo ID (público)
async function GetById(req, res) {
  const id = req.params.id;
  const responseData = await myModel.GetById(id);
  return responseData;
}

// Listar eventos da empresa autenticada
async function GetMeusEventos(req, res) {
  const idEmpresa = await verificarEmpresa(req);
  const responseData = await myModel.GetMeusEventos(idEmpresa);
  return responseData;
}

// Cadastrar evento vinculado à empresa autenticada
async function Post(req, res) {
  const idEmpresa = await verificarEmpresa(req);
  const payload = req.body;

  const responseData = await myModel.Post(payload, idEmpresa);
  return responseData;
}

// Editar evento da própria empresa
async function Put(req, res) {
  const idEmpresa = await verificarEmpresa(req);
  const id = req.params.id;
  const payload = req.body;

  const responseData = await myModel.Put(
    payload,
    id,
    idEmpresa
  );

  return responseData;
}

// Excluir evento da própria empresa
async function Delete(req, res) {
  const idEmpresa = await verificarEmpresa(req);
  const id = req.params.id;

  const responseData = await myModel.Delete(
    id,
    idEmpresa
  );

  return responseData;
}

function EndPointName() {
  return myModel.EndPointName();
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
