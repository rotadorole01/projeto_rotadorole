
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

dotenv.config();

const uploads = require("./utils/upload.js");
const routes = require("./view/routes.js");
const autenticacao = require("./middleware/autenticacao.js");
const loginsModel = require("./model/loginsModel.js");
const { db } = require("./databases/DatabaseContext.js");

const Port = process.env.API_PORT || 3600;

const app = express();

// CONFIGURAÇÃO CORS
// const corsOptions = {
//     origin: [
//         "http://127.0.0.1:5500",
//         "http://localhost:8181",
//         "http://localhost:3600"
//     ],
//     credentials: true
// };

// app.use(cors(corsOptions));
app.use(cors());

// RECEBER JSON
app.use(express.json());

// ROTAS DA API
app.use(routes);

// SERVIR ARQUIVOS DE UPLOAD
app.use(
    "/uploads",
    express.static(path.resolve(__dirname, "..", "uploads"))
);

// VERIFICAR CONTA EMPRESA/CNPJ
async function verificarEmpresa(req, res, next) {
    try {
        const usuario = await loginsModel.GetById(req.usuarioId);

        if (!usuario) {
            return res.status(401).json({
                message: "Conta não encontrada."
            });
        }

        if (usuario.tipo_conta !== "cnpj") {
            return res.status(403).json({
                message: "Upload exclusivo para contas Empresa/CNPJ."
            });
        }

        next();
    } catch (error) {
        console.error("Erro ao verificar empresa:", error);

        return res.status(500).json({
            message: "Erro ao verificar a conta."
        });
    }
}

// UPLOAD DE IMAGEM
app.post(
    "/upload",
    autenticacao,
    verificarEmpresa,
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
                        Buffer.from("89504e470d0a1a0a", "hex")
                    );

                const webp =
                    dados.length >= 12 &&
                    dados.toString("ascii", 0, 4) === "RIFF" &&
                    dados.toString("ascii", 8, 12) === "WEBP";

                const extensao = path.extname(req.file.filename);

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
                console.error("Erro ao validar imagem:", error);

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
            console.log(`Servidor rodando na porta: ${Port}`);
            console.log("Projeto Integrador - 11/06/2026");
            console.log("Yasmin e Gustavo");
        });

    } catch (error) {
        console.error("Erro ao iniciar servidor:", error);
        process.exit(1);
    }
}

startServer();
