const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const myController = require('../controller/loginsController.js');
const autenticacao = require('../middleware/autenticacao.js');

const routes = express.Router();
const endPoint = `/${myController.EndPointName()}`;
const uploadDir = path.resolve(__dirname, '../../uploads/perfis');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}.jpg`)
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const types = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
    if (!types[file.mimetype]) return cb(new Error('Formato inválido. Envie JPG, PNG ou WebP.'));
    // A extensão definitiva é definida após o upload, usando o tipo permitido.
    req.extensaoFoto = types[file.mimetype];
    cb(null, true);
  }
});

const respond = fn => async (req, res) => {
  try {
    const result = await fn(req);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('Erro na API de contas:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

routes.post(`${endPoint}/cadastro`, respond(myController.Cadastro));
routes.post(`${endPoint}/entrar`, respond(myController.Entrar));
routes.get(`${endPoint}/perfil`, autenticacao, respond(myController.Perfil));
routes.put(`${endPoint}/perfil`, autenticacao, respond(myController.AtualizarPerfil));
routes.put(`${endPoint}/senha`, autenticacao, respond(myController.AlterarSenha));
routes.post(`${endPoint}/foto`, autenticacao, (req, res) => {
  upload.single('foto')(req, res, async err => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'Imagem não enviada.' });
    try {
      // Não confiar apenas no MIME informado pelo cliente: conferir assinatura do arquivo.
      const data = fs.readFileSync(req.file.path);
      const jpeg = data.length > 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
      const png = data.length > 8 && data.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
      const webp = data.length > 12 && data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP';
      const ext = jpeg ? '.jpg' : png ? '.png' : webp ? '.webp' : null;
      if (!ext || ext !== req.extensaoFoto) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Conteúdo da imagem inválido.' });
      }
      const newPath = req.file.path.replace(/\.jpg$/, ext);
      if (newPath !== req.file.path) fs.renameSync(req.file.path, newPath);
      req.file.filename = path.basename(newPath);
      const result = await myController.Foto(req);
      return res.status(result.status).json(result.body);
    } catch (error) {
      console.error('Erro no upload:', error);
      return res.status(500).json({ message: 'Erro ao salvar foto.' });
    }
  });
});
module.exports = routes;
