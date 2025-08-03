function aplicarMascaraCNPJ(valor) {
  return valor
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}

document.getElementById("cnpj").addEventListener("input", (e) => {
  e.target.value = aplicarMascaraCNPJ(e.target.value);
});

document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();

  const cnpj = document.getElementById("cnpj").value;
  const senha = document.getElementById("senha").value;

  try {
    const sucesso = await eel.login(cnpj, senha)();
    if (sucesso) {
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("erro-msg").classList.remove("hidden");
    }
  } catch (err) {
    console.error("Erro ao logar:", err);
    document.getElementById("erro-msg").classList.remove("hidden");
  }
});
