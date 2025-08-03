document.getElementById("form-cadastro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const cnpj = document.getElementById("cnpj").value;
  const nome = document.getElementById("nome").value;
  const senha = document.getElementById("senha").value;
  const plano = document.getElementById("plano").value;

  try {
    await eel.cadastrar_farmacia(cnpj, nome, senha, plano)();
    window.location.href = "login.html";
  } catch (err) {
    console.error("Erro ao cadastrar:", err);
    document.getElementById("erro-msg").classList.remove("hidden");
  }
});

// === MÁSCARA DE CNPJ ===
function aplicarMascaraCNPJ(valor) {
  return valor
    .replace(/\D/g, "") // remove tudo que não for número
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18);
}

document.getElementById("cnpj").addEventListener("input", (e) => {
  e.target.value = aplicarMascaraCNPJ(e.target.value);
});
