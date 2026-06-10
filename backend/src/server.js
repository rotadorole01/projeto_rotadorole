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

// -----------------------------------------------------
// [NOVA] ROTA POST PATROCINADOR - SALVAR NO BANCO
// -----------------------------------------------------
app.post('/patrocinadores', async (req, res) => {
    try {
        const p = req.body;

        if (!p.titulo || !p.descricao || !p.imagem) {
            return res.status(400).json({ success: false, message: "Campos obrigatórios ausentes (titulo, descricao ou imagem)!" });
        }

        // Query apontando para a tabela nova criada pelo mysqlSchema.js
        const query = `
            INSERT INTO patrocinadores_carrossel (titulo, descricao, imagem)
            VALUES (?, ?, ?)
        `;

        const params = [p.titulo, p.descricao, p.imagem];

        const resultado = await db.execute(query, params);
        res.json({ success: true, insertId: resultado.insertId });

    } catch (err) {
        console.error("Erro ao salvar patrocinador:", err);
        res.status(500).json({ success: false, message: "Erro ao salvar patrocinador no banco" });
    }
});

// -----------------------------------------------------
// [NOVA] ROTA GET PATROCINADORES - LISTAR PARA O CARROSSEL
// -----------------------------------------------------
app.get('/api/patrocinadores', async (req, res) => {
    try {
        const query = `SELECT titulo, descricao, imagem FROM patrocinadores_carrossel`;
        
        // AJUSTADO: Desestruturando o array retornado para pegar diretamente as linhas do MySQL
        const [linhas] = await db.execute(query);

        // Garante que o resultado seja tratado como um array válido
        const patrocinadoresValidos = Array.isArray(linhas) ? linhas : [];

        // Converte o caminho relativo armazenado (/uploads/...) em uma URL completa acessível pelo frontend
        const patrocinadoresFormatados = patrocinadoresValidos.map(p => {
            if (!p || !p.imagem) return null;

            const urlImagem = p.imagem.startsWith('http') 
                ? p.imagem 
                : `http://localhost:${Port}${p.imagem.startsWith('/') ? '' : '/'}${p.imagem}`;

            return {
                titulo: p.titulo,
                descricao: p.descricao,
                imagem: urlImagem
            };
        }).filter(item => item !== null); // Remove registros nulos se houver falhas

        res.json(patrocinadoresFormatados);

    } catch (err) {
        console.error("Erro ao buscar patrocinadores:", err);
        res.status(500).json({ success: false, message: "Erro ao buscar patrocinadores no banco" });
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