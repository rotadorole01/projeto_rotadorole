# Usa uma imagem oficial do Nginx baseada no Alpine Linux (leve e segura)
FROM nginx:alpine

# Remove a configuração padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia nossa configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove a página padrão de boas-vindas do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos do projeto web para o diretório padrão do Nginx
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]