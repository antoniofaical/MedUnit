// #~#~#~#~#~# AUTENTICAÇÃO #~#~#~#~#~#

async function tentarLogin(cnpj, senha) {
    const sucesso = await eel.login(cnpj, senha)();
    return sucesso;
}

async function carregarConfiguracoes() {
    const config = await eel.carregar_configuracoes()();
    return config;
}

// #~#~#~#~#~# MÓDULOS #~#~#~#~#~#

async function obterListaModulos() {
    const lista = await eel.get_lista_modulos()();
    return lista;
}

async function carregarModulo(mod_id) {
    const dados = await eel.carregar_modulo(mod_id)();
    return dados;
}

async function salvarModulo(mod_id, dados_dict) {
    const resposta = await eel.salvar_modulo(mod_id, dados_dict)();
    return resposta;
}

async function limparDadosModulo(mod_id) {
    const resposta = await eel.limpar_dados_modulo(mod_id)();
    return resposta;
}

async function atualizarEstoque(mod_id) {
    const resposta = await eel.atualizar_estoque_modulo(mod_id)();
    return resposta;
}

async function verificarExistenciaModulo(mod_id) {
    const existe = await eel.modulo_existe_check(mod_id)();
    return existe;
}

// #~#~#~#~#~# CONEXÃO COM MÓDULO FÍSICO #~#~#~#~#~#

async function escanearDispositivosBLE() {
    const lista = await eel.scan_dispositivos()();
    return lista;
}

async function conectarAutomaticamente() {
    const mac = await eel.conectar_automaticamente()();
    return mac;
}

async function conectarAoModulo(mac) {
    const conectado = await eel.conectar_a_modulo(mac)();
    return conectado;
}

async function obterJsonDoModulo(mac) {
    const json = await eel.obter_json_modulo(mac)();
    return json;
}

async function enviarJsonParaModulo(mac, dados_dict) {
    const resposta = await eel.enviar_json_modulo(mac, dados_dict)();
    return resposta;
}
