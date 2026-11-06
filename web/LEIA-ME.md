# Projeto Rota do Rolê 📍

Este projeto foi desenvolvido para a disciplina da FATEC, focado em uma plataforma de eventos da cidade.

## 🚀 Como usar com XAMPP

Para rodar este projeto no seu computador, siga os passos abaixo:

### 1. Configuração do Banco de Dados
1. Abra o **XAMPP Control Panel** e inicie o **Apache** e o **MySQL**.
2. Clique no botão **Admin** do MySQL ou acesse `http://localhost/phpmyadmin` no seu navegador.
3. Clique na aba **Importar**.
4. Selecione o arquivo `sql/database.sql` que está dentro da pasta do projeto.
5. Clique em **Executar** no final da página. Isso criará o banco `rota_do_role` e as tabelas necessárias.

### 2. Configuração dos Arquivos
1. Copie a pasta `rota_do_role` inteira.
2. Cole dentro do diretório `htdocs` do seu XAMPP (geralmente em `C:\xampp\htdocs`).
3. Acesse no seu navegador: `http://localhost/rota_do_role/index.html`.

## 📂 Estrutura do Projeto
- `index.html`: Página inicial com carrossel de eventos e parceiros.
- `eventos.html`: Listagem de todos os eventos com filtros por categoria.
- `cadastro.html`: Formulário completo para postagem de novos eventos.
- `css/style.css`: Estilos personalizados e responsivos.
- `js/script.js`: Lógica do carrossel, filtros e validação de formulário.
- `sql/database.sql`: Script para criação do banco de dados MySQL.

## 🛠️ Próximos Passos (Backend PHP)
Como o projeto agora tem uma estrutura de banco de dados, você pode transformar os arquivos `.html` em `.php` e usar comandos como `mysqli_connect` para buscar os eventos diretamente do banco de dados que criamos.

---
Desenvolvido com foco em modernidade e facilidade de uso. Boa sorte com o projeto da FATEC! 🎓
