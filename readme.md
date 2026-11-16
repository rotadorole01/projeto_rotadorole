# ROTA DO ROLÊ — INSTRUÇÕES PARA EXECUTAR O PROJETO

O projeto possui três partes principais:

- **Back:** API Node.js/Express responsável pela comunicação com o banco.
- **Mobile:** aplicativo desenvolvido com Expo/React Native.
- **Web:** site desenvolvido com HTML, CSS e JavaScript.

O Mobile e o Web utilizam a mesma API e o banco de dados MySQL `rotadorole`.

## 1. PROGRAMAS NECESSÁRIOS

Antes de iniciar, instalar:

- Node.js
- Visual Studio Code
- XAMPP (MySQL)
- Git bash
- Extensão Live Server no VS Code
- Android Studio (para utilizar o emulador Android)
- Expo Go (para testar no celular físico)

**Atenção:** a versão do Expo Go precisa ser compatível com o SDK do projeto. Caso utilize SDK 57, instalar o Expo Go correspondente.

## 2. CONFIGURAR O BANCO DE DADOS

1. Abrir o XAMPP.
2. Iniciar o serviço MySQL.
3. Abrir o phpMyAdmin
4. Criar o banco `rotadorole`, caso ainda não exista.
5. Importar o arquivo de backup SQL disponibilizado.

Comando para criar o banco:
CREATE DATABASE IF NOT EXISTS rotadorole;
USE rotadorole;

Para conferir as tabelas:
SHOW TABLES;


**Importante:** cada computador possui seu próprio banco local. Os dados não são compartilhados automaticamente entre computadores.

## 3. CONFIGURAR O BACKEND (PASTA BACK)

Abrir o terminal na pasta `back` e executar:

```bash
npm install
```

Criar um arquivo chamado `.env` dentro da pasta `back`, utilizando o `.env.example` como referência.

Exemplo de configuração:

```env
API_PORT=3600

DB_TYPE=mysql
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_PORT=3600
DB_DATABASE=rotadorole

JWT_SECRET=COLE_AQUI_SUA_CHAVE_GERADA
```

### Gerar a chave JWT

No terminal, execute:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiar a chave gerada e substituir o valor de `JWT_SECRET` no `.env`.

Essa chave é utilizada para assinar e validar os tokens de autenticação.

Não é necessário gerar uma nova chave toda vez que iniciar o projeto, apenas quando baixar do git novamente.

**Nunca enviar o arquivo `.env` real para o GitHub.**

### Iniciar o Backend

Na pasta `back`, executar:

```bash
npm run dev
```

O terminal deverá confirmar a conexão com o MySQL e mostrar que o servidor está rodando na porta 3600.

## 4. CONFIGURAR O MOBILE

Abrir outro terminal na pasta `mobile`.

Instalar as dependências:

```bash
npm install
```

Criar o arquivo `.env` dentro da pasta `mobile`, utilizando o `.env.example` como referência.

### Descobrir o IP do computador

No Windows:

1. Pressionar Windows + R.
2. Digitar `cmd` e pressionar Enter.
3. Executar:

```cmd
ipconfig
```

4. Procurar o Endereço IPv4 da conexão utilizada.
5. Substituir `SEU_IP` pelo IPv4 encontrado.

### Para utilizar o Mobile no celular (Expo Go)

1. Conectar o **computador e o celular à mesma rede Wi-Fi**.
2. Iniciar o MySQL pelo XAMPP.
3. Na pasta `back`, iniciar a API:

```bash
npm run dev
```

4. Configurar o `.env` do Mobile com o IP do computador.
5. Na pasta `mobile`, executar:

```bash
npm run start
```

6. Abrir o **Expo Go** no celular e escanear o QR Code exibido no terminal.

**Importante:** o computador e o celular devem estar na mesma rede Wi-Fi para que o aplicativo consiga acessar a API local.

## 5. EXECUTAR O WEB

1. Abrir a pasta `web` no VS Code.
2. Iniciar a página principal utilizando a extensão Live Server.
3. Manter o Backend funcionando na porta 3600.
4. Conferir se os arquivos HTML/JavaScript utilizam o endereço correto da API.

Para o Web executado no mesmo computador do Backend, o endereço será:

```text
http://localhost:3600
```

Se aparecer `Failed to fetch`, verificar:

- Se o Backend está rodando.
- Se a porta da API está correta.
- Se o endereço utilizado pelo Web está correto.
- Se o CORS permite a origem do Live Server.

## 7. ERROS COMUNS

**Erro: ECONNREFUSED no Backend**

O MySQL pode estar desligado, utilizando outra porta ou recusando a conexão. Verificar o XAMPP e as configurações do `back/.env`.

**Erro: secretOrPrivateKey must have a value**

O `JWT_SECRET` não está configurado corretamente no `back/.env`. Gerar uma chave e reiniciar o Backend.

**Erro: Failed to fetch no Web**

O Web não conseguiu acessar a API. Verificar endereço, porta, servidor e CORS.

**Erro: Não foi possível conectar à API no Mobile**

Verificar o IP configurado em `mobile/.env`, a rede e se o Backend está rodando.

**Erro: Expo Go incompatível**

A versão do Expo Go não corresponde ao SDK utilizado pelo projeto. Instalar a versão compatível.

**Aviso: No route named ou missing default export**

Aviso do Expo Router relacionado à organização ou declaração das rotas. Verificar os arquivos em `mobile/src/app`.

## 8. CUIDADOS IMPORTANTES

- Não enviar arquivos `.env` reais ao GitHub.
- Não compartilhar chaves JWT.
- Utilizar `.env.example` como referência.
- Não modificar tabelas ou apagar dados sem fazer backup.
- Conferir o IP do computador sempre que mudar de rede.
- Manter o Backend rodando enquanto utiliza Mobile e Web.
- Não atualizar o Expo ou as dependências sem verificar a compatibilidade.
- Fazer commit e push das alterações necessárias no GitHub, sem incluir arquivos secretos.

## 9. ORDEM RECOMENDADA PARA INICIAR O PROJETO

**Terminal 1 — Backend**

```bash
cd back
npm run dev
```
**MySQL**

O serviço MySQL deve estar iniciado antes de executar o Backend.

**Terminal 2 — Mobile**

```bash
cd mobile
npm run android
```

Ou, para utilizar o Expo Go:

```bash
npm run start
```

**Web**

Abrir o site utilizando o Live Server.
---

## OBSERVAÇÃO FINAL

O Mobile e o Web compartilham as contas e os eventos por meio do Backend e do banco MySQL `rotadorole`.
