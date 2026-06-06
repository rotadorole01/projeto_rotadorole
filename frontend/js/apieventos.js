const API_URL = "http://localhost:3600/eventos";

const eventForm = document.getElementById('eventForm');

eventForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Coletando dados do formulário
    const titulo = document.getElementById('titulo').value;
    const categoria = document.getElementById('categoria').value;
    const descricao = document.getElementById('descricao').value;
    const data = document.getElementById('data').value; // formato ISO
    const horario = document.getElementById('horario').value;
    const duracao = document.getElementById('duracao').value;
    const localizacao = document.getElementById('localizacao').value;
    const cidade = document.getElementById('cidade').value;
    const bairro = document.getElementById('bairro').value;
    const ingresso = document.getElementById('ingresso').value;
    const preco = document.getElementById('preco').value;
    const link = document.getElementById('link').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;

    // Input da imagem
    const input = document.getElementById('imagem');
    const arquivo = input.files[0];

    let nomeArquivo = null;

    // Se houver imagem, envia primeiro para /upload
    if (arquivo) {
        const formData = new FormData();
        formData.append('title', arquivo.name);
        formData.append('avatar', arquivo);

        try {
            const response = await fetch("http://localhost:3600/upload", {
                method: 'POST',
                body: formData
            });

            const dataImagem = await response.json();
            if (!dataImagem.success) {
                alert("Erro ao enviar a imagem do evento!");
                return;
            }

            console.log("Arquivo enviado:", dataImagem);
            nomeArquivo = dataImagem.filename; // pega o nome do arquivo enviado
        } catch (err) {
            console.error("Erro ao enviar a imagem:", err);
            alert("Erro ao enviar a imagem do evento!");
            return;
        }
    }

    // Monta o objeto de dados do evento
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

    console.log("Dados a enviar para o backend:", dados);

    // Envia os dados completos para /eventos
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();

        if (resultado.success) {
            alert('Evento cadastrado com sucesso!');
            eventForm.reset();
        } else if (resultado.exists) {
            alert('Evento já existente!');
        } else {
            alert('Erro ao cadastrar evento. Tente novamente.');
        }

    } catch (error) {
        console.error("Erro na conexão com o servidor:", error);
        alert('Erro de conexão com o servidor.');
    }
});

// Função para preencher os inputs automaticamente (exceto arquivo)
function carregarDados() {
    const setInput = (id, valor) => {
        const el = document.getElementById(id);
        if(el) el.value = valor;
    };

    setInput('titulo', 'Festival de Jazz na Praça');
    setInput('email', 'teste@fatectq.edu.br');
    setInput('data', '2026-05-15'); 
    setInput('categoria', 'shows');
    setInput('descricao', 'Um evento cultural incrível com os melhores músicos da região. Entrada gratuita para todos!');
    setInput('horario', '18:00:00');
    setInput('duracao', '4');
    setInput('localizacao', 'Praça Central');
    setInput('cidade', 'Taquaritinga');
    setInput('bairro', 'Portal da serra');
    setInput('ingresso', 'gratuito');
    setInput('preco', '');
    setInput('imagem', 'FestivaldeJazz.webp'); // campo manual
    setInput('link', '');
    setInput('nome', 'lulu');
    setInput('telefone', '(16) 3252-5555');
}

document.addEventListener('DOMContentLoaded', carregarDados);
window.addEventListener('pageshow', carregarDados);