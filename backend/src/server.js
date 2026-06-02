const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const uploads = require("./utils/upload.js"); // Multer
const routes = require("./view/routes.js");
const { db } = require('./databases/DatabaseContext.js'); // seu DB context

dotenv.config();

const Port = process.env.API_PORT || 3600;

const app = express();

// -------------------
// CONFIGURAÇÃO CORS
// -------------------
const corsOptions = {
    origin: [
        'http://127.0.0.1:5500',
        'http://localhost:5500',
        'http://localhost:3600'
    ],
    credentials: true
};
app.use(cors(corsOptions));

// parser JSON
app.use(express.json());

// rotas existentes
app.use(routes);

// servir arquivos de upload
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// -------------------
// ROTA UPLOAD DE IMAGEM
// -------------------
app.post('/upload', uploads.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Erro ao fazer upload do arquivo!' });
    }

    console.log("Arquivo enviado:", req.file);
    res.json({ success: true, filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

// -------------------
// ROTA POST EVENTO - SALVAR NO BANCO
// -------------------
app.post('/eventos', async (req, res) => {
    try {
        const e = req.body;

        // query SQL com placeholders
        const query = `
            INSERT INTO eventos
            (titulo, horario, data, localizacao, categoria, duracao, valor, entradaingresso,
             cidade, bairro, descricao, link, nome, email, telefone, imagem)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            e.titulo,
            e.horario,
            e.data,
            e.localizacao,
            e.categoria,
            e.duracao,
            e.valor || null,
            e.ingresso,
            e.cidade,
            e.bairro,
            e.descricao,
            e.link,
            e.nome,
            e.email,
            e.telefone,
            e.imagem || null
        ];

        // insere no banco usando seu DB context
        const resultado = await db.execute(query, params);

        res.json({ success: true, insertId: resultado.insertId });

    } catch (err) {
        console.error("Erro ao salvar evento:", err);
        res.status(500).json({ success: false, message: "Erro ao salvar evento no banco" });
    }
});

// -------------------
// START SERVER
// -------------------
async function startServer() {
    console.log(`Iniciando banco de dados: ${process.env.DB_TYPE}`);
    await db.init();
    
    app.listen(Port, () => {        
        console.log(`Servidor rodando na porta: ${Port}`);
        console.log(`Projeto Integrador - 11/06/2026`);
        console.log(`Yasmin e Gustavo`);
    });
}

startServer();