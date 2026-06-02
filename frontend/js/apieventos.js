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

    setInput('titulo', 'Vestibular Fatec');
    setInput('email', 'Secretaria@fatectq.edu.br');
    setInput('data', '2026-04-07'); 
    setInput('categoria', 'Cultural');
    setInput('descricao', 'Inscrições para o processo seletivo da Fatec, venha fazer seu curso superior gratuito e ficar em outro nível, inscrições abertas do dia 07/04/2026 até as 15hrs de 01/06/2026.');
    setInput('horario', '15:00:00');
    setInput('duracao', '5');
    setInput('localizacao', 'Fatec Taquaritinga, Av. Dr. Flávio Henrique Lemos 585');
    setInput('cidade', 'Taquaritinga');
    setInput('bairro', 'Portal Itamaracá - 15906-522');
    setInput('ingresso', 'Pago');
    setInput('preco', '80');
    setInput('imagem', ''); // campo manual
    setInput('link', 'https://fatectq.cps.sp.gov.br/');
    setInput('nome', 'Marcus');
    setInput('telefone', '(16) 3252-5250');
}

document.addEventListener('DOMContentLoaded', carregarDados);
window.addEventListener('pageshow', carregarDados);