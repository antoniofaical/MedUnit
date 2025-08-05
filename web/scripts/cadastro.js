document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");
  const erroMsg = document.getElementById("erro-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    erroMsg.classList.add("hidden");

    const nome = document.getElementById("nome").value.trim();
    const cnpj = document.getElementById("cnpj").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;
    const plano = document.getElementById("plano").value;

    if (senha !== confirmarSenha) {
      erroMsg.textContent = "As senhas não coincidem.";
      erroMsg.classList.remove("hidden");
      return;
    }

    try {
      const hash = await eel.gerar_hash(senha)();

      const config = {
        nome_farmacia: nome,
        cnpj: cnpj,
        senha_hash: hash,
        plano: plano.toUpperCase(),
        modulos: []
      };

      await eel.salvar_config(config)();
      window.location.href = "login.html";
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      erroMsg.textContent = "Erro ao salvar dados. Tente novamente.";
      erroMsg.classList.remove("hidden");
    }
  });
});
