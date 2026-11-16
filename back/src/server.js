
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

dotenv.config();

const uploads = require("./utils/upload.js");
const routes = require("./view/routes.js");
const autenticacao = require("./middleware/autenticacao.js");
const { db } = require("./databases/DatabaseContext.js");

const Port = process.env.API_PORT || 3600;

const app = express();

// CONFIGURAÇÃO CORS
app.use(cors());

// RECEBER JSON
app.use(express.json());

// PASTAS DE UPLOAD
const pastaUploadsNova = path.resolve(__dirname, "uploads");
const pastaUploadsAntiga = path.resolve(__dirname, "..", "uploads");

fs.mkdirSync(pastaUploadsNova, { recursive: true });

// SERVIR IMAGENS NOVAS
app.use(
    "/uploads",
    express.static(pastaUploadsNova)
);

// MANTER COMPATIBILIDADE COM IMAGENS ANTIGAS
app.use(
    "/uploads",
    express.static(pastaUploadsAntiga)
);

// ROTAS DA API
app.use(routes);

// UPLOAD DE IMAGEM PARA QUALQUER USUÁRIO AUTENTICADO
app.post(
    "/upload",
    autenticacao,
    (req, res) => {
        uploads.single("avatar")(req, res, (erro) => {
            if (erro) {
                return res.status(400).json({
                    success: false,
                    message: erro.message
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Nenhuma imagem enviada."
                });
            }

            try {
                const dados = fs.readFileSync(req.file.path);

                const jpeg =
                    dados.length >= 3 &&
                    dados[0] === 0xff &&
                    dados[1] === 0xd8 &&
                    dados[2] === 0xff;

                const png =
                    dados.length >= 8 &&
                    dados.subarray(0, 8).equals(
                        Buffer.from(
                            "89504e470d0a1a0a",
                            "hex"
                        )
                    );

                const webp =
                    dados.length >= 12 &&
                    dados.toString("ascii", 0, 4) === "RIFF" &&
                    dados.toString("ascii", 8, 12) === "WEBP";

                const extensao = path.extname(
                    req.file.filename
                ).toLowerCase();

                const imagemValida =
                    (extensao === ".jpg" && jpeg) ||
                    (extensao === ".png" && png) ||
                    (extensao === ".webp" && webp);

                if (!imagemValida) {
                    fs.unlinkSync(req.file.path);

                    return res.status(400).json({
                        success: false,
                        message: "Conteúdo da imagem inválido."
                    });
                }

                return res.json({
                    success: true,
                    filename: req.file.filename,
                    path: `/uploads/${req.file.filename}`
                });

            } catch (error) {
                console.error(
                    "Erro ao validar imagem:",
                    error
                );

                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                return res.status(500).json({
                    success: false,
                    message: "Erro ao processar imagem."
                });
            }
        });
    }
);

// INICIAR SERVIDOR
async function startServer() {
    try {
        console.log(
            `Iniciando banco de dados: ${process.env.DB_TYPE}`
        );

        await db.init();

        app.listen(Port, () => {
            console.log(
                `Servidor rodando na porta: ${Port}`
            );
            console.log(
                "Projeto Integrador - 19/11/2026"
            );
            console.log("Yasmin e Gustavo");
        });

    } catch (error) {
        console.error(
            "Erro ao iniciar servidor:",
            error
        );

        process.exit(1);
    }
}

startServer();
