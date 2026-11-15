/* Rota do Rolê - autenticação do cabeçalho compartilhado */
(function () {
  "use strict";

  async function atualizarCabecalho() {
    const menu = document.querySelector(".user-profile-menu");
    const botao = document.getElementById("profileMenuBtn");
    const entrar = document.getElementById("linkEntrarCabecalho");
    if (!menu || !botao) return;

    const linksCadastro = document.querySelectorAll('a[href="cadastro.html"]');
    function exibirDeslogado() {
      document.documentElement.classList.remove("rota-autenticado");
      menu.style.setProperty("display", "none", "important");
      if (entrar) entrar.style.setProperty("display", "inline-flex", "important");
      const dropdown = document.getElementById("profileDropdown");
      if (dropdown) {
        dropdown.classList.remove("show");
        dropdown.style.display = "none";
      }
      linksCadastro.forEach(link => {
        link.hidden = true;
        const li = link.closest("li");
        if (li) li.hidden = true;
      });
    }

    exibirDeslogado();
    const token = sessionStorage.getItem("rota_token");
    if (!token) return;

    try {
      if (typeof API_CONFIG === "undefined" || !API_CONFIG.BASE_URL) return;
      const resposta = await fetch(`${API_CONFIG.BASE_URL}/logins/perfil`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resposta.ok) {
        if (resposta.status === 401 || resposta.status === 403) {
          sessionStorage.removeItem("rota_token");
        }
        return;
      }
      const resultado = await resposta.json();
      if (!resultado || !resultado.data) return;
      if (entrar) entrar.style.setProperty("display", "none", "important");
      menu.style.setProperty("display", "inline-block", "important");
      document.documentElement.classList.add("rota-autenticado");
      linksCadastro.forEach(link => {
        link.hidden = false;
        const li = link.closest("li");
        if (li) li.hidden = false;
      });
    } catch (erro) {
      console.warn("Não foi possível confirmar a sessão do cabeçalho:", erro);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".user-profile-menu .logout-btn").forEach(link => {
      link.addEventListener("click", () => sessionStorage.removeItem("rota_token"));
    });
    atualizarCabecalho();
  });
  window.addEventListener("pageshow", atualizarCabecalho);
})();
