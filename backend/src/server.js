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

// rotas existentes (rotas em arquivos externos)
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

// -----------------------------------------------------
// [AUTENTICAÇÃO] POST /api/auth - VERIFICAR LOGIN REAL
// -----------------------------------------------------
app.post('/api/auth', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ success: false, message: "E-mail e senha são obrigatórios!" });
        }

        // Busca o usuário correspondente ao e-mail na tabela logins
        const query = `SELECT id, name, email, password FROM logins WHERE email = ? LIMIT 1`;
        const [rows] = await db.execute(query, [email]);

        // Se não encontrar o e-mail
        if (!rows || rows.length === 0) {
            return res.status(401).json({ success: false, message: "E-mail ou senha incorretos." });
        }

        const usuario = rows[0];

        // Confere se a senha confere
        if (usuario.password !== senha) {
            return res.status(401).json({ success: false, message: "E-mail ou senha incorretos." });
        }

        // Login validado com sucesso!
        res.json({
            success: true,
            message: "Login efetuado com sucesso!",
            user: {
                id: usuario.id,
                name: usuario.name,
                email: usuario.email
            }
        });

    } catch (err) {
        console.error("Erro na autenticação:", err);
        res.status(500).json({ success: false, message: "Erro interno no servidor ao autenticar." });
    }
});

// -----------------------------------------------------
// [CRUD LOGINS] 1. POST /login - SALVAR NOVO USUÁRIO
// -----------------------------------------------------
app.post('/login', async (req, res) => {
    try {
        const u = req.body;

        if (!u.nomeCompleto || !u.email || !u.senha) {
            return res.status(400).json({ success: false, message: "Campos obrigatórios ausentes (nomeCompleto, email ou senha)!" });
        }

        // Verifica se o e-mail já existe
        const checkQuery = `SELECT id FROM logins WHERE email = ? LIMIT 1`;
        const [rows] = await db.execute(checkQuery, [u.email]);
        
        if (rows && rows.length > 0) {
            return res.json({ success: false, exists: true, message: "Usuário já cadastrado!" });
        }

        // Insere o novo usuário
        const insertQuery = `
            INSERT INTO logins (name, email, password, validated) 
            VALUES (?, ?, ?, 1)
        `;
        const params = [u.nomeCompleto, u.email, u.senha];
        const resultado = await db.execute(insertQuery, params);

        res.json({ success: true, message: "Usuário cadastrado com sucesso!", insertId: resultado.insertId });

    } catch (err) {
        console.error("Erro ao cadastrar usuário:", err);
        res.status(500).json({ success: false, message: "Erro interno ao salvar usuário no banco." });
    }
});

// -----------------------------------------------------
// [CRUD LOGINS] 2. GET /login - LISTAR TODOS OS USUÁRIOS
// -----------------------------------------------------
app.get('/login', async (req, res) => {
    try {
        const query = `SELECT id, name, email, validated FROM logins`;
        const [linhas] = await db.execute(query);
        res.json(linhas);
    } catch (err) {
        console.error("Erro ao listar usuários:", err);
        res.status(500).json({ success: false, message: "Erro ao buscar usuários." });
    }
});

// -----------------------------------------------------
// [CRUD LOGINS] 3. GET /login/:id - BUSCAR USUÁRIO POR ID
// -----------------------------------------------------
app.get('/login/:id', async (req, res) => {
    try {
        const query = `SELECT id, name, email, validated FROM logins WHERE id = ?`;
        const [linhas] = await db.execute(query, [req.params.id]);
        
        if (linhas.length === 0) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado." });
        }
        res.json(linhas[0]);
    } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        res.status(500).json({ success: false, message: "Erro ao buscar usuário." });
    }
});

// -----------------------------------------------------
// [CRUD LOGINS] 4. PUT /login/:id - ATUALIZAR USUÁRIO POR ID
// -----------------------------------------------------
app.put('/login/:id', async (req, res) => {
    try {
        const { nomeCompleto, email, senha } = req.body;
        const query = `
            UPDATE logins 
            SET name = ?, email = ?, password = ? 
            WHERE id = ?
        `;
        const params = [nomeCompleto, email, senha, req.params.id];
        await db.execute(query, params);

        res.json({ success: true, message: "Usuário updated com sucesso!" });
    } catch (err) {
        console.error("Erro ao atualizar usuário:", err);
        res.status(500).json({ success: false, message: "Erro ao atualizar usuário." });
    }
});

// -----------------------------------------------------
// [CRUD LOGINS] 5. DELETE /login/:id - DELETAR USUÁRIO POR ID
// -----------------------------------------------------
app.delete('/login/:id', async (req, res) => {
    try {
        const query = `DELETE FROM logins WHERE id = ?`;
        await db.execute(query, [req.params.id]);

        res.json({ success: true, message: "Usuário deletado permanentemente!" });
    } catch (err) {
        console.error("Erro ao deletar usuário:", err);
        res.status(500).json({ success: false, message: "Erro ao deletar usuário." });
    }
});

// -------------------
// ROTA POST EVENTO
// -------------------
app.post('/eventos', async (req, res) => {
    try {
        const e = req.body;

        const query = `
            INSERT INTO eventos
            (titulo, horario, data, localizacao, categoria, duracao, valor, entradaingresso,
             cidade, bairro, descricao, link, nome, email, telefone, imagem)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            e.titulo, e.horario, e.data, e.localizacao, e.categoria, e.duracao,
            e.valor || null, e.ingresso, e.cidade, e.bairro, e.descricao, e.link,
            e.nome, e.email, e.telefone, e.imagem || null
        ];

        const resultado = await db.execute(query, params);
        res.json({ success: true, insertId: resultado.insertId });

    } catch (err) {
        console.error("Erro ao salvar evento:", err);
        res.status(500).json({ success: false, message: "Erro ao salvar evento no banco" });
    }
});

// -----------------------------------------------------
// ROTA POST PATROCINADOR
// -----------------------------------------------------
app.post('/patrocinadores', async (req, res) => {
    try {
        const p = req.body;

        if (!p.titulo || !p.descricao || !p.imagem) {
            return res.status(400).json({ success: false, message: "Campos obrigatórios ausentes!" });
        }

        const query = `INSERT INTO patrocinadores_carrossel (titulo, descricao, imagem) VALUES (?, ?, ?)`;
        const params = [p.titulo, p.descricao, p.imagem];

        const resultado = await db.execute(query, params);
        res.json({ success: true, insertId: resultado.insertId });

    } catch (err) {
        console.error("Erro ao salvar patrocinador:", err);
        res.status(500).json({ success: false, message: "Erro ao salvar patrocinador no banco" });
    }
});

// -----------------------------------------------------
// ROTA GET PATROCINADORES
// -----------------------------------------------------
app.get('/api/patrocinadores', async (req, res) => {
    try {
        const query = `SELECT titulo, descricao, imagem FROM patrocinadores_carrossel`;
        const [linhas] = await db.execute(query);
        const patrocinadoresValidos = Array.isArray(linhas) ? linhas : [];

        const patrocinadoresFormatados = patrocinadoresValidos.map(p => {
            if (!p || !p.imagem) return null;
            const urlImagem = p.imagem.startsWith('http') 
                ? p.imagem 
                : `http://localhost:${Port}${p.imagem.startsWith('/') ? '' : '/'}${p.imagem}`;
            return { titulo: p.titulo, descricao: p.descricao, imagem: urlImagem };
        }).filter(item => item !== null);

        res.json(patrocinadoresFormatados);
    } catch (err) {
        console.error("Erro ao buscar patrocinadores:", err);
        res.status(500).json({ success: false, message: "Erro ao buscar patrocinadores" });
    }
});

// -----------------------------------------------------
// ROTA GET DESTAQUES
// -----------------------------------------------------
app.get('/api/destaques', async (req, res) => {
    try {
        const query = `SELECT id, titulo, descricao, imagem FROM destaques_carrossel`;
        const [linhas] = await db.execute(query);
        const destaquesValidos = Array.isArray(linhas) ? linhas : [];

        const destaquesFormatados = destaquesValidos.map(d => {
            if (!d || !d.imagem) return null;
            const urlImagem = d.imagem.startsWith('http') 
                ? d.imagem 
                : `http://localhost:${Port}${d.imagem.startsWith('/') ? '' : '/'}${d.imagem}`;
            return { id: d.id, titulo: d.titulo, descricao: d.descricao, imagem: urlImagem };
        }).filter(item => item !== null);

        res.json(destaquesFormatados);
    } catch (err) {
        console.error("Erro ao buscar destaques:", err);
        res.status(500).json({ success: false, message: "Erro ao buscar destaques" });
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
        console.log(`Projeto Integrador - Rota do Rolê`);
    });
}

startServer();