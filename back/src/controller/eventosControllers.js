
const myModel = require("../model/eventosModel.js");
const loginsModel = require("../model/loginsModel.js");

// Verifica se o usuário possui uma conta autenticada
async function verificarUsuario(req) {
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

  // Pessoa Física e Empresa/CNPJ podem cadastrar eventos
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

// Listar eventos do usuário autenticado
async function GetMeusEventos(req, res) {
  const usuarioId = await verificarUsuario(req);
  const responseData = await myModel.GetMeusEventos(usuarioId);
  return responseData;
}

// Cadastrar evento vinculado ao usuário autenticado
async function Post(req, res) {
  const usuarioId = await verificarUsuario(req);
  const payload = req.body;

  const responseData = await myModel.Post(payload, usuarioId);
  return responseData;
}

// Editar evento do próprio usuário
async function Put(req, res) {
  const usuarioId = await verificarUsuario(req);
  const id = req.params.id;
  const payload = req.body;

  const responseData = await myModel.Put(
    payload,
    id,
    usuarioId
  );

  return responseData;
}

// Excluir evento do próprio usuário
async function Delete(req, res) {
  const usuarioId = await verificarUsuario(req);
  const id = req.params.id;

  const responseData = await myModel.Delete(
    id,
    usuarioId
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
