# Rota do Rolê — configuração da API (porta 3600)

Este projeto usa **uma API Node.js na porta 3600** tanto para a WEB quanto para o MOBILE. A WEB pode ser servida em outra porta (por exemplo 8181 com Docker), o Expo utiliza sua própria porta e o MySQL normalmente usa 3306; isso não significa que existam várias APIs.

## WEB
- Configuração central: `web/js/apiConfig.js`.
- Todas as páginas HTML carregam esse arquivo antes de fazer requisições.
- Por padrão, o host da API acompanha o hostname da WEB (`window.location.hostname`) e a porta é `3600`.
- Se a API estiver em outro computador, ajuste `HOST` nesse arquivo para o IP ou domínio da máquina da API. Se mudar a porta, altere `PORT`.
- URLs de login, cadastro, perfil, eventos, envio de imagens e imagens de eventos usam `API_CONFIG.BASE_URL`.

## MOBILE (Expo)
- Configuração central: `mobile/src/app/utils/api.ts`.
- O cadastro de eventos também utiliza `API_URL`, como as demais chamadas de login/cadastro.
- Se executar **no celular físico**, copie `mobile/.env.example` para `mobile/.env`, coloque o IPv4 atual do computador que roda o backend e reinicie o Expo com `npx expo start -c`.
- No Windows, descubra o IPv4 executando `ipconfig`. O telefone e o computador devem estar na mesma rede e a porta 3600 precisa estar acessível pelo firewall.
- Se executar **Expo Web** com `mobile/.env` definido, o mesmo endereço configurado será usado. Se não houver `.env`, a versão WEB do Expo usa `localhost:3600`; Android/iOS usam o IP de fallback `192.168.0.111` (troque pelo IP real da rede).

Exemplo em `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_DO_COMPUTADOR:3600
```

## Backend
- Node.js: na pasta `back`, configure seu `back/.env` (credenciais do MySQL) e execute `npm install` e `npm run dev`. A porta padrão já é `3600` (`API_PORT=3600`).
- Docker Compose: backend exposto em `3600:3600`; WEB em `8181:80`. Execute `docker compose up --build` apenas se já tiver a rede Docker externa `fatectqnet` configurada e o banco acessível pelo serviço configurado.
- Nenhuma tabela, migração, rota nem regra de negócio foi modificada.

**Importante:** O arquivo `web/parceria.html` contém um placeholder `URL_API_PARCEIRO` anterior a esta atualização, não um endpoint real. Ele foi preservado para não inventar uma rota que não existe.
