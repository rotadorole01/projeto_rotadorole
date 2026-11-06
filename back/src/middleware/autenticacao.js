
const jwt = require("jsonwebtoken");

function autenticacao(req, res, next) {
    const authorization = req.headers.authorization || "";

    const match = /^Bearer (.+)$/i.exec(authorization);

    if (!match) {
        return res.status(401).json({
            message: "Token de autenticação não informado."
        });
    }

    try {
        const usuario = jwt.verify(
            match[1],
            process.env.JWT_SECRET,
            { algorithms: ["HS256"] }
        );

        if (
            !Number.isSafeInteger(usuario.id) ||
            usuario.id < 1
        ) {
            return res.status(401).json({
                message: "Token de usuário inválido."
            });
        }

        req.usuarioId = usuario.id;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token inválido ou expirado."
        });
    }
}

module.exports = autenticacao;
