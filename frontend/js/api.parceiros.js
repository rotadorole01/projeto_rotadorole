const API_URL = "http://localhost:3600/parceiros";

const eventForm = document.getElementById('eventForm');

eventForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Coletando dados do formulário
    const nomeempresa = document.getElementById('empresaNome').value;
    const cnjp = document.getElementById('cnjp').value;
    const areaAtuacao = document.getElementById('areaAtuacao').value;
    const responsavel = document.getElementById('responsavel').value; // formato ISO
    const telefoneComercial = document.getElementById('telefoneComercial').value;
    const emailComercial = document.getElementById('emailComercial').value;
    const localizacao = document.getElementById('tipoParceria').value;
    const mensagem = document.getElementById('mensagem').value;


    // Monta o objeto de dados do evento
    const dados = {
       empresaNome,
       cnjp,
       areaAtuacao,
       responsavel,
       telefoneComercial,
       emailComercial,
       tipoParceria,
       mensagem
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
            alert('Parceria cadastrada com sucesso!');
            eventForm.reset();
        } else if (resultado.exists) {
            alert('Parceria já cadastrada!');
        } else {
            //alert('Erro ao cadastrar evento. Tente novamente.');
        }

    } catch (error) {
        console.error("Erro na conexão com o servidor:", error);
        //alert('Erro de conexão com o servidor.');
    }
});


document.addEventListener('DOMContentLoaded', carregarDados);
window.addEventListener('pageshow', carregarDados);