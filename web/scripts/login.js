document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-login");
  const erroMsg = document.getElementById("erro-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    erroMsg.classList.add("hidden");

    const cnpj = document.getElementById("cnpj").value.trim();
    const senha = document.getElementById("senha").value;

    try {
      const resposta = await eel.login(cnpj, senha)();

      if (resposta.sucesso === true) {
        // Armazena nome da farmácia no localStorage (para o dashboard)
        localStorage.setItem("farmacia_nome", resposta.nome);
        window.location.href = "dashboard.html";
      } else {
        erroMsg.textContent = resposta.erro || "Erro ao efetuar login.";
        erroMsg.classList.remove("hidden");
      }
    } catch (error) {
      console.error("Erro na requisição de login:", error);
      erroMsg.textContent = "Erro inesperado. Tente novamente.";
      erroMsg.classList.remove("hidden");
    }
  });
});
