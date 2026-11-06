
const myModel = require('../model/loginsModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const fail = (status, message) => ({
  status,
  body: { message }
});

const ok = (status, data) => ({
  status,
  body: { message: 'Success', data }
});

const validEmail = value =>
  typeof value === 'string' &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) &&
  value.length <= 254;

const validName = value =>
  typeof value === 'string' &&
  value.trim().length >= 2 &&
  value.trim().length <= 120;

const validPassword = value =>
  typeof value === 'string' &&
  value.length >= 8 &&
  Buffer.byteLength(value, 'utf8') <= 72;

const normalizedEmail = value => value.trim().toLowerCase();

async function Cadastro(req) {
  const {
    name,
    email,
    password,
    tipoConta = "usuario",
    cnpj = null,
    nomeEmpresa = null
  } = req.body || {};

  if (!["usuario", "cnpj"].includes(tipoConta)) {
    return fail(400, "Tipo de conta inválido.");
  }

  const empresa = tipoConta === "cnpj";

  const cnpjLimpo = empresa
    ? String(cnpj || "").replace(/\D/g, "")
    : null;

  if (
    empresa &&
    (cnpjLimpo.length !== 14 || !validName(nomeEmpresa))
  ) {
    return fail(
      400,
      "Informe CNPJ com 14 dígitos e nome da empresa."
    );
  }

  if (
    !validName(name) ||
    !validEmail(email) ||
    !validPassword(password)
  ) {
    return fail(
      400,
      'Informe nome (2 a 120 caracteres), e-mail válido e senha de 8 a 72 bytes.'
    );
  }

  const normalized = normalizedEmail(email);

  if (await myModel.FindByEmail(normalized)) {
    return fail(409, 'E-mail já cadastrado.');
  }

  try {
    return ok(
      201,
      await myModel.Post({
        name: name.trim(),
        email: normalized,
        password,
        tipo_conta: tipoConta,
        cnpj: cnpjLimpo,
        nome_empresa: empresa ? nomeEmpresa.trim() : null
      })
    );
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return fail(409, 'E-mail já cadastrado.');
    }

    throw err;
  }
}

async function Entrar(req) {
  const { email, password } = req.body || {};

  if (!validEmail(email) || typeof password !== 'string') {
    return fail(400, 'E-mail e senha inválidos.');
  }

  const user = await myModel.FindByEmail(
    normalizedEmail(email)
  );

  if (!user) {
    return fail(401, 'E-mail ou senha inválidos.');
  }

  if (!/^\$2[aby]\$\d\d\$/.test(user.password)) {
    return fail(
      403,
      'Conta antiga sem senha protegida. Solicite a redefinição da senha ao administrador.'
    );
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return fail(401, 'E-mail ou senha inválidos.');
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    {
      expiresIn: '2h',
      algorithm: 'HS256'
    }
  );

  return ok(200, {
    token,
    usuario: await myModel.GetById(user.id)
  });
}

async function Perfil(req) {
  const user = await myModel.GetById(req.usuarioId);

  return user
    ? ok(200, user)
    : fail(404, 'Usuário não encontrado.');
}

async function AtualizarPerfil(req) {
  const current = await myModel.GetById(req.usuarioId);

  if (!current) {
    return fail(404, 'Usuário não encontrado.');
  }

  const body = req.body || {};

  // O tipo de conta é definido no cadastro e não pode ser alterado.
  if (
    body.tipoConta !== undefined &&
    body.tipoConta !== current.tipo_conta
  ) {
    return fail(
      403,
      'O tipo de conta não pode ser alterado.'
    );
  }

  const name = body.name === undefined
    ? current.name
    : body.name;

  const email = body.email === undefined
    ? current.email
    : body.email;

  const telefone = body.telefone === undefined
    ? current.telefone
    : body.telefone;

  const cidade = body.cidade === undefined
    ? current.cidade
    : body.cidade;

  // Sempre utilizar o tipo de conta registrado no MySQL.
  const tipo_conta = current.tipo_conta;

  const empresa = tipo_conta === "cnpj";

  const cnpj = empresa
    ? String(
        body.cnpj === undefined
          ? (current.cnpj || "")
          : body.cnpj
      ).replace(/\D/g, "")
    : null;

  const nome_empresa = empresa
    ? (
        body.nomeEmpresa === undefined
          ? current.nome_empresa
          : body.nomeEmpresa
      )
    : null;

  if (
    !["usuario", "cnpj"].includes(tipo_conta) ||
    (
      empresa &&
      (
        cnpj.length !== 14 ||
        !validName(nome_empresa)
      )
    )
  ) {
    return fail(400, "Dados da empresa inválidos.");
  }

  if (
    !validName(name) ||
    !validEmail(email) ||
    (
      telefone != null &&
      (
        typeof telefone !== 'string' ||
        telefone.length > 20
      )
    ) ||
    (
      cidade != null &&
      (
        typeof cidade !== 'string' ||
        cidade.length > 120
      )
    )
  ) {
    return fail(400, 'Dados de perfil inválidos.');
  }

  const normalized = normalizedEmail(email);

  const other = await myModel.FindByEmail(normalized);

  if (
    other &&
    Number(other.id) !== Number(req.usuarioId)
  ) {
    return fail(409, 'E-mail já cadastrado.');
  }

  try {
    return ok(
      200,
      await myModel.Put(req.usuarioId, {
        name: name.trim(),
        email: normalized,
        telefone: telefone || null,
        cidade: cidade || null,
        tipo_conta,
        cnpj,
        nome_empresa: empresa
          ? nome_empresa.trim()
          : null
      })
    );
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return fail(409, 'E-mail já cadastrado.');
    }

    throw err;
  }
}

async function AlterarSenha(req) {
  const { senhaAtual, novaSenha } = req.body || {};

  if (
    typeof senhaAtual !== 'string' ||
    !validPassword(novaSenha)
  ) {
    return fail(
      400,
      'Informe a senha atual e uma nova senha de 8 a 72 bytes.'
    );
  }

  const perfil = await myModel.GetById(req.usuarioId);

  if (!perfil) {
    return fail(404, 'Usuário não encontrado.');
  }

  const user = await myModel.FindByEmail(perfil.email);

  if (!user) {
    return fail(404, 'Usuário não encontrado.');
  }

  if (!/^\$2[aby]\$\d\d\$/.test(user.password)) {
    return fail(
      403,
      'Conta antiga: solicite redefinição de senha ao administrador.'
    );
  }

  if (!(await bcrypt.compare(senhaAtual, user.password))) {
    return fail(401, 'Senha atual incorreta.');
  }

  if (senhaAtual === novaSenha) {
    return fail(
      400,
      'A nova senha deve ser diferente da atual.'
    );
  }

  await myModel.UpdatePassword(
    req.usuarioId,
    novaSenha
  );

  return ok(200, {
    aviso: 'Senha alterada. Entre novamente usando a nova senha.'
  });
}

async function Foto(req) {
  if (!req.file) {
    return fail(
      400,
      'Envie uma imagem JPG, PNG ou WebP.'
    );
  }

  const user = await myModel.UpdatePhoto(
    req.usuarioId,
    `/uploads/perfis/${req.file.filename}`
  );

  return user
    ? ok(200, user)
    : fail(404, 'Usuário não encontrado.');
}

function EndPointName() {
  return myModel.EndPointName();
}

module.exports = {
  Cadastro,
  Entrar,
  Perfil,
  AtualizarPerfil,
  AlterarSenha,
  Foto,
  EndPointName
};
