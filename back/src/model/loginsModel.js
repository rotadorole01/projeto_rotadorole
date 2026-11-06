const { db } = require('../databases/DatabaseContext.js');
const bcrypt = require('bcryptjs');

const tableName = 'logins';
const publicFields = 'id, name, email, telefone, cidade, foto_perfil, tipo_conta, cnpj, nome_empresa, validated';

async function FindByEmail(email) {
  const [rows] = await db.execute('SELECT * FROM logins WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

async function GetById(id) {
  const [rows] = await db.execute(`SELECT ${publicFields} FROM logins WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function Post({ name, email, password, tipo_conta, cnpj, nome_empresa }) {
  const hash = await bcrypt.hash(password, 12);
  const [result] = await db.execute(
    'INSERT INTO logins (name, email, password, validated, tipo_conta, cnpj, nome_empresa) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, hash, 0, tipo_conta, cnpj, nome_empresa]
  );
  return GetById(result.insertId);
}

async function Put(id, { name, email, telefone, cidade, tipo_conta, cnpj, nome_empresa }) {
  const [result] = await db.execute(
    'UPDATE logins SET name = ?, email = ?, telefone = ?, cidade = ?, tipo_conta = ?, cnpj = ?, nome_empresa = ? WHERE id = ?',
    [name, email, telefone, cidade, tipo_conta, cnpj, nome_empresa, id]
  );
  return result.affectedRows ? GetById(id) : null;
}

async function UpdatePhoto(id, filename) {
  const [result] = await db.execute('UPDATE logins SET foto_perfil = ? WHERE id = ?', [filename, id]);
  return result.affectedRows ? GetById(id) : null;
}

async function UpdatePassword(id, newPassword) {
  const hash = await bcrypt.hash(newPassword, 12);
  const [result] = await db.execute('UPDATE logins SET password = ? WHERE id = ?', [hash, id]);
  return result.affectedRows > 0;
}

function EndPointName() { return tableName; }
module.exports = { FindByEmail, GetById, Post, Put, UpdatePhoto, UpdatePassword, EndPointName };
