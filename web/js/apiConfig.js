// Configuração única da URL da API para todas as páginas WEB.
// Para mudar a porta da API, altere apenas PORT aqui.
// Por padrão, o host é o mesmo usado para acessar a WEB, inclusive na rede local.
const API_CONFIG = Object.freeze({
    HOST: window.location.hostname || "localhost",
    PORT: 3600,
    get BASE_URL() {
        return `http://${this.HOST}:${this.PORT}`;
    }
});
