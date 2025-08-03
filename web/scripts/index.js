async function verificarConfiguracoes() {
    try {
    const config = await eel.carregar_configuracoes()();
    // Se carregar com sucesso, redireciona para login
    window.location.href = "login.html";
    } catch (e) {
    // Se der erro (ex: FileNotFoundError), redireciona para cadastro
    window.location.href = "cadastro.html";
    }
}

setTimeout(verificarConfiguracoes, 1000);
