
import eel
import os
from backend.auth import verificar_login, criar_config, carregar_config
from backend.modulos import (
    listar_modulos,
    carregar_modulo_validado,
    salvar_modulo_validado,
    limpar_modulo,
    atualizar_estoque,
    modulo_existe,
)
from backend.conexao import (
    listar_dispositivos_BT,
    conectar_modulo,
    ler_json_do_modulo,
    enviar_json_para_modulo,
)

# Pasta do frontend
eel.init("web")  


#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~# AUTENTICAÇÃO #~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#

@eel.expose
def login(cnpj, senha):
    return verificar_login(cnpj, senha)


@eel.expose
def carregar_configuracoes():
    return carregar_config()


@eel.expose
def cadastrar_farmacia(cnpj, nome, senha, plano):
    criar_config(cnpj, nome, senha, plano) 

#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~# MÓDULOS #~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#

@eel.expose
def get_lista_modulos():
    return listar_modulos()


@eel.expose
def carregar_modulo(mod_id):
    try:
        return carregar_modulo_validado(mod_id)
    except Exception as e:
        return {"erro": str(e)}


@eel.expose
def salvar_modulo(mod_id, dados_dict):
    try:
        salvar_modulo_validado(mod_id, dados_dict)
        return {"status": "OK"}
    except Exception as e:
        return {"erro": str(e)}


@eel.expose
def limpar_dados_modulo(mod_id):
    try:
        limpar_modulo(mod_id)
        return {"status": "OK"}
    except Exception as e:
        return {"erro": str(e)}


@eel.expose
def atualizar_estoque_modulo(mod_id):
    try:
        atualizar_estoque(mod_id)
        return {"status": "OK"}
    except Exception as e:
        return {"erro": str(e)}


@eel.expose
def modulo_existe_check(mod_id):
    return modulo_existe(mod_id)


#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~# CONEXÃO COM MÓDULO FÍSICO #~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#

@eel.expose
def scan_dispositivos():
    return eel.loop.run_until_complete(listar_dispositivos_BT())


@eel.expose
def conectar_automaticamente():
    return eel.loop.run_until_complete(conectar_automaticamente())

@eel.expose
def conectar_a_modulo(mac):
    return eel.loop.run_until_complete(conectar_modulo(mac))

@eel.expose
def obter_json_modulo(mac):
    return eel.loop.run_until_complete(ler_json_do_modulo(mac))


@eel.expose
def enviar_json_modulo(mac, dados_dict):
    return eel.loop.run_until_complete(enviar_json_para_modulo(mac, dados_dict))


#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~# INICIAR APP #~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#

if __name__ == "__main__":
    eel.start("index.html")
