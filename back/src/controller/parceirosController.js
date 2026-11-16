
const myModel = require("../model/parceirosModel.js");
const loginsModel = require("../model/loginsModel.js");

async function Get(req, res) {
    return await myModel.Get();
}

async function GetById(req, res) {
    return await myModel.GetById(req.params.id);
}

async function Post(req, res) {
    return await myModel.Post(req.body);
}

async function Put(req, res) {
    return await myModel.Put(req.body, req.params.id);
}

async function Delete(req, res) {
    return await myModel.Delete(req.params.id);
}

function EndPointName() {
    return myModel.EndPointName();
}

const mensagemSucesso =
    "Cadastro recebido com sucesso! Nossa equipe recebeu sua " +
    "solicitação de patrocínio e entrará em contato para informar " +
    "sobre a aprovação e, caso aprovado, definir os detalhes " +
    "da parceria. Aguarde nosso retorno!";

const mensagemDuplicada =
    "Você já possui uma solicitação de patrocínio cadastrada. " +
    "Aguarde o retorno da nossa equipe.";

function texto(valor) {
    return typeof valor === "string" ? valor.trim() : "";
}

// Consultar a solicitação do usuário autenticado
async function MinhaSolicitacao(req, res) {
    const usuario = await loginsModel.GetById(req.usuarioId);

    if (!usuario) {
        return {
            status: 401,
            body: {
                success: false,
                message: "Conta não encontrada."
            }
        };
    }

    const solicitacao = await myModel.BuscarPorUsuario(usuario.id);

    return {
        status: 200,
        body: {
            success: true,
            exists: Boolean(solicitacao),
            data: solicitacao
        }
    };
}

// Receber solicitação de patrocínio
async function SolicitarPatrocinio(req, res) {
    const usuario = await loginsModel.GetById(req.usuarioId);

    if (!usuario) {
        return {
            status: 401,
            body: {
                success: false,
                message: "Conta não encontrada."
            }
        };
    }

    const existente = await myModel.BuscarPorUsuario(usuario.id);

    if (existente) {
        return {
            status: 409,
            body: {
                success: false,
                exists: true,
                message: mensagemDuplicada
            }
        };
    }

    const dados = {
        empresaNome: texto(req.body?.empresaNome),
        cnpj: texto(req.body?.cnpj).replace(/\D/g, ""),
        areaAtuacao: texto(req.body?.areaAtuacao),
        responsavel: texto(req.body?.responsavel),
        telefoneComercial: texto(req.body?.telefoneComercial),
        emailComercial: texto(req.body?.emailComercial),
        tipoParceria: texto(req.body?.tipoParceria),
        mensagem: texto(req.body?.mensagem)
    };

    if (
        !dados.empresaNome ||
        !dados.areaAtuacao ||
        !dados.responsavel ||
        !dados.telefoneComercial ||
        !dados.emailComercial ||
        !dados.tipoParceria
    ) {
        return {
            status: 400,
            body: {
                success: false,
                message: "Preencha todos os campos obrigatórios."
            }
        };
    }

    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.emailComercial)
    ) {
        return {
            status: 400,
            body: {
                success: false,
                message: "Informe um e-mail válido."
            }
        };
    }

    if (dados.cnpj && dados.cnpj.length !== 14) {
        return {
            status: 400,
            body: {
                success: false,
                message: "O CNPJ deve conter 14 dígitos."
            }
        };
    }

    if (
        dados.empresaNome.length > 200 ||
        dados.responsavel.length > 200 ||
        dados.telefoneComercial.length > 15 ||
        dados.emailComercial.length > 254 ||
        dados.mensagem.length > 5000
    ) {
        return {
            status: 400,
            body: {
                success: false,
                message: "Um ou mais campos ultrapassaram o limite permitido."
            }
        };
    }

    const areasPermitidas = [
        "gastronomia",
        "bar",
        "entretenimento",
        "servicos",
        "outro"
    ];

    const interessesPermitidos = [
        "patrocinio_site",
        "destaque_eventos",
        "parceria_divulgacao"
    ];

    if (
        !areasPermitidas.includes(dados.areaAtuacao) ||
        !interessesPermitidos.includes(dados.tipoParceria)
    ) {
        return {
            status: 400,
            body: {
                success: false,
                message: "Selecione uma opção válida."
            }
        };
    }

    try {
        const id = await myModel.CriarSolicitacao(
            dados,
            usuario.id
        );

        return {
            status: 201,
            body: {
                success: true,
                message: mensagemSucesso,
                data: { id }
            }
        };

    } catch (erro) {
        // A restrição UNIQUE do MySQL impede cadastros simultâneos
        if (erro.code === "ER_DUP_ENTRY" || erro.errno === 1062) {
            return {
                status: 409,
                body: {
                    success: false,
                    exists: true,
                    message: mensagemDuplicada
                }
            };
        }

        throw erro;
    }
}

module.exports = {
    Get,
    GetById,
    Post,
    Put,
    Delete,
    MinhaSolicitacao,
    SolicitarPatrocinio,
    EndPointName
};
