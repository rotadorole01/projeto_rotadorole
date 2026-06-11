const API_URL_CADASTRO = "http://localhost:3600/login";
const API_URL_AUTENTICAR = "http://localhost:3600/api/auth";

// =====================================================
// FLUXO 1: CADASTRO DE USUÁRIO
// =====================================================
const eventForm = document.getElementById('eventForm');

if (eventForm) {
    eventForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const tipoConta = document.getElementById('tipoConta').value;
        const nomeCompleto = document.getElementById('nomeCompleto').value;
        const cnpj = document.getElementById('cnpj').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        const dados = { tipoConta, nomeCompleto, cnpj, email, senha };

        console.log("Dados a enviar para o cadastro:", dados);

        try {
            const response = await fetch(API_URL_CADASTRO, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);

            const resultado = await response.json();

            if (resultado.success) {
                alert('Usuário cadastrado com sucesso! Redirecionando para a tela de login...');
                eventForm.reset();
                
                // Redireciona o utilizador automaticamente para a tela de apenas logar
                window.location.href = "entrar.html"; 
            } else if (resultado.exists) {
                alert('Usuário já cadastrado!');
            } else {
                alert(resultado.message || 'Erro ao cadastrar. Tente novamente.');
            }
        } catch (error) {
            console.error("Erro na conexão com o servidor:", error);
            alert('Erro de conexão com o servidor.');
        }
    });
}

// =====================================================
// FLUXO 2: TELA DE ENTRAR (LOGIN REAL)
// =====================================================
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        const dadosLogin = { email, senha };

        console.log("Tentando autenticar usuário:", dadosLogin);

        try {
            const response = await fetch(API_URL_AUTENTICAR, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosLogin)
            });

            if (response.status === 404) {
                alert('A rota POST /api/auth não foi encontrada no backend. Verifique o seu server.js.');
                return;
            }

            const resultado = await response.json();

            if (resultado.success) {
                alert(`Bem-vindo de volta, ${resultado.user.name}!`);
                
                // Salva os dados de sessão localmente no navegador
                localStorage.setItem('userEmail', resultado.user.email);
                localStorage.setItem('userName', resultado.user.name);
                
                // Redireciona o usuário para a página inicial
                window.location.href = "index.html";
            } else {
                alert(resultado.message || 'E-mail ou senha incorretos.');
            }
        } catch (error) {
            console.error("Erro ao autenticar:", error);
            alert('Erro de conexão ao tentar fazer login.');
        }
    });
}