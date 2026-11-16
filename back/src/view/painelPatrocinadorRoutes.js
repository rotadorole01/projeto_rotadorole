// Painel exclusivo: autorização sempre validada no servidor.
const express = require("express");
const autenticacao = require("../middleware/autenticacao");
const logins = require("../model/loginsModel");
const routes = express.Router();

routes.get("/patrocinador/painel", autenticacao, async (req, res) => {
  try {
    const usuario = await logins.GetById(req.usuarioId);
    if (!usuario) return res.status(401).json({ message: "Usuário não encontrado." });

    // Somente UM login aprovado por vez. Definir no .env do backend.
    const aprovado = Number(process.env.PATROCINADOR_APROVADO_ID);
    if (!Number.isSafeInteger(aprovado) || aprovado <= 0 ||
        Number(usuario.id) !== aprovado || usuario.tipo_conta !== "cnpj") {
      return res.status(403).json({ message: "Acesso restrito a patrocinadores aprovados." });
    }

    // Ainda não existe coleta real de visualizações/seguidores no projeto.
    // Os gráficos da tela são demonstrativos e não são enviados como métricas reais.
    return res.json({
      message: "Success",
      data: {
        empresa: usuario.nome_empresa || usuario.name,
        responsavel: usuario.name,
        status: "aprovado",
        metricasDisponiveis: false,
        observacao: "Painel demonstrativo: métricas reais ainda não integradas."
      }
    });
  } catch (error) {
    console.error("Erro ao acessar painel do patrocinador:", error);
    return res.status(500).json({ message: "Erro ao consultar patrocinador." });
  }
});

module.exports = routes;
