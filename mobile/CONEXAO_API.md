# Conexão do aplicativo com a API

1. Inicie o MySQL e confira as credenciais no arquivo `backend/.env`.
2. No computador, descubra o IPv4 da rede Wi-Fi (Windows: `ipconfig`).
3. Crie `mobile/.env` copiando `.env.example` e troque `192.168.0.100` pelo IPv4 real.
4. No backend, execute `npm install` e `npm run dev`.
5. No mobile, reinicie o Expo com `npx expo start -c`.
6. Celular e computador precisam estar na mesma rede Wi-Fi. Libere a porta 3600 no firewall do Windows, se necessário.

O app agora usa `/logins/entrar` e `/logins/cadastro`, guarda o JWT e os dados do usuário no AsyncStorage e envia o token nas consultas autenticadas futuras.

## Atenção: ajuste necessário no backend/banco

Ao revisar o backend, encontrei uma incompatibilidade que precisa ser resolvida antes de testar o cadastro/login com MySQL:
- `loginsModel.js` usa `tipo_conta`, `cnpj`, `nome_empresa`, `telefone`, `cidade` e `foto_perfil`, mas `mysqlSchema.js` cria `logins` apenas com `id`, `name`, `email`, `password` e `validated`.
- `eventosModel.js` consulta/grava `id_empresa`, mas a criação de `eventos` em `mysqlSchema.js` não inclui essa coluna.

Não apague nem recrie o banco. Faça uma cópia de segurança e aplique migrações `ALTER TABLE` compatíveis com a estrutura que já existe, ou confirme se o banco já possui essas colunas. O schema atual também chama `CREATE TABLE IF NOT EXISTS`, que não adiciona colunas a tabelas já criadas.

O cadastro empresarial ainda não foi ativado na tela mobile porque o formulário não coleta CNPJ nem nome da empresa, que são obrigatórios na API.
