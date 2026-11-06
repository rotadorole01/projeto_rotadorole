# Dockerfile para Backend (Node.js no Alpine)
FROM node:24-alpine

# Instala dependências necessárias para compilar módulos nativos (como o sqlite3)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

# Instala as dependências forçando a compilação limpa dentro do container
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]