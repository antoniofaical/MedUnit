document.addEventListener("DOMContentLoaded", () => {
  eel.verificar_config()(function (existe) {
    setTimeout(() => {
      if (existe === true) {
        window.location.href = "login.html";
      } else {
        window.location.href = "cadastro.html";
      }
    }, 500); 
  });
});
