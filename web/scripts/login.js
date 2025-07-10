// scripts/login.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Impede o envio real do formulário
      // Redireciona para o dashboard (login fictício por enquanto)
      window.location.href = "dashboard.html";
    });
  }
});
