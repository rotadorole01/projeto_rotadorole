
const API_URL = `${API_CONFIG.BASE_URL}/eventos`;

const eventForm = document.getElementById("eventForm");

if (eventForm) {
    eventForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const botaoEnviar = eventForm.querySelector('[type="submit"]');

        if (botaoEnviar && botaoEnviar.disabled) {
            return;
        }

        // Recupera o token salvo no login
        const token = sessionStorage.getItem("rota_token");

        if (!token) {
            alert(
                "Você precisa entrar em uma conta Empresa/CNPJ " +
                "para cadastrar eventos."
            );

            window.location.href = "entrar.html";
            return;
        }

        if (botaoEnviar) {
            botaoEnviar.disabled = true;
        }

        try {
            // Coleta os dados do formulário
            const titulo = document.getElementById("titulo").value;
            const categoria = document.getElementById("categoria").value;
            const descricao = document.getElementById("descricao").value;
            const data = document.getElementById("data").value;
            const horario = document.getElementById("horario").value;
            const duracao = document.getElementById("duracao").value;
            const localizacao = document.getElementById("localizacao").value;
            const cidade = document.getElementById("cidade").value;
            const bairro = document.getElementById("bairro").value;
            const ingresso = document.getElementById("ingresso").value;
            const preco = document.getElementById("preco").value;
            const link = document.getElementById("link").value;
            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const telefone = document.getElementById("telefone").value;

            // Verifica se há uma imagem selecionada
            const input = document.getElementById("imagem");
            const arquivo = input ? input.files[0] : null;

            let nomeArquivo = null;

            // Faz o upload da imagem, quando informada
            if (arquivo) {
                const formData = new FormData();

                formData.append("title", arquivo.name);
                formData.append("avatar", arquivo);

                const respostaImagem = await fetch(
                    `${API_CONFIG.BASE_URL}/upload`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        body: formData
                    }
                );

                const dadosImagem = await respostaImagem.json();

                if (!respostaImagem.ok || !dadosImagem.success) {
                    console.error("Erro no upload:", dadosImagem);

                    alert(
                        dadosImagem.message ||
                        "Erro ao enviar a imagem do evento!"
                    );

                    return;
                }

                nomeArquivo = dadosImagem.filename;

                console.log("Imagem enviada:", nomeArquivo);
            }

            // Dados enviados ao MySQL por meio da API
            const dados = {
                imagem: nomeArquivo,
                titulo,
                categoria,
                descricao,
                data,
                horario,
                duracao,
                localizacao,
                cidade,
                bairro,
                ingresso,
                preco,
                link,
                nome,
                email,
                telefone
            };

            // Não enviamos id_empresa.
            // O backend identifica a empresa pelo token JWT.

            console.log("Dados do evento:", dados);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(dados)
            });

            const resultado = await response.json();

            console.log("Status HTTP:", response.status);
            console.log("Resposta da API:", resultado);

            if (resultado.exists) {
                alert("Evento já existente!");
                return;
            }

            if (response.status === 401) {
                alert(
                    "Sua sessão expirou ou não é válida. " +
                    "Entre novamente na sua conta."
                );

                window.location.href = "entrar.html";
                return;
            }

            if (response.status === 403) {
                alert(
                    resultado.message ||
                    "Somente contas Empresa/CNPJ podem cadastrar eventos."
                );
                return;
            }

            if (response.ok && resultado.message !== "Error") {
                alert("Evento cadastrado com sucesso!");

                eventForm.reset();
            } else {
                console.error("Erro ao cadastrar evento:", resultado);

                alert(
                    resultado.message ||
                    "Erro ao cadastrar evento. Tente novamente."
                );
            }

        } catch (error) {
            console.error("Erro na comunicação com a API:", error);

            alert(
                "Não foi possível concluir o cadastro. " +
                "Verifique a conexão com o servidor."
            );

        } finally {
            if (botaoEnviar) {
                botaoEnviar.disabled = false;
            }
        }
    });
}

// Preenchimento automático para testes
function carregarDados() {
    const setInput = (id, valor) => {
        const el = document.getElementById(id);

        if (el && el.type !== "file") {
            el.value = valor;
        }
    };

    setInput("titulo", "Festival de Jazz na Praça");
    setInput("email", "teste@fatectq.edu.br");
    setInput("data", "2026-05-15");
    setInput("categoria", "shows");

    setInput(
        "descricao",
        "Um evento cultural incrível com os melhores músicos da região. Entrada gratuita para todos!"
    );

    setInput("horario", "18:00:00");
    setInput("duracao", "4");
    setInput("localizacao", "Praça Central");
    setInput("cidade", "Taquaritinga");
    setInput("bairro", "Portal da serra");
    setInput("ingresso", "gratuito");
    setInput("preco", "");
    setInput("link", "");
    setInput("nome", "lulu");
    setInput("telefone", "(16) 3252-5555");
}

document.addEventListener("DOMContentLoaded", carregarDados);
window.addEventListener("pageshow", carregarDados);
