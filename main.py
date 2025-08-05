import eel
import asyncio
from backend.utils import (
    carregar_config,
    salvar_config,
    carregar_modulo,
    salvar_modulo,
    verificar_senha,
)
from backend.bluetooth import conectar_modulo_async, enviar_json_para_modulo_async

eel.init("web")


# ===== AUTENTICAÇÃO =====


@eel.expose
def login(cnpj: str, senha: str):
    try:
        config = carregar_config()
        if cnpj != config["cnpj"]:
            return {"erro": "CNPJ não encontrado."}
        if not verificar_senha(senha, config["senha_hash"]):
            return {"erro": "Senha incorreta."}
        return {"sucesso": True, "nome": config["nome_farmacia"]}
    except Exception as e:
        return {"erro": str(e)}


@eel.expose
def gerar_hash(senha: str):
    from backend.utils import gerar_hash

    return gerar_hash(senha)


@eel.expose
def salvar_config(config: dict):
    from backend.utils import salvar_config

    salvar_config(config)


@eel.expose
def verificar_config():
    try:
        carregar_config()
        return True
    except:
        return False


# ===== DADOS DOS MÓDULOS =====


@eel.expose
def listar_modulos():
    try:
        config = carregar_config()
        return config.get("modulos", [])
    except Exception as e:
        return {"erro": str(e)}


@eel.expose
def carregar_modulo_backend(mod_id: str):
    try:
        return carregar_modulo(mod_id)
    except Exception as e:
        return {"erro": str(e)}


@eel.expose
def salvar_modulo_backend(mod_id: str, dados: dict):
    try:
        salvar_modulo(mod_id, dados)
        return {"sucesso": True}
    except Exception as e:
        return {"erro": str(e)}


# ===== CONEXÃO BLE =====


@eel.expose
def ble_conectar(mod_id: str):
    try:
        return asyncio.run(conectar_modulo_async(mod_id))
    except Exception as e:
        return {"erro": str(e)}


@eel.expose
def ble_enviar(mod_id: str, json_data: dict):
    try:
        sucesso = asyncio.run(enviar_json_para_modulo_async(mod_id, json_data))
        return {"sucesso": sucesso}
    except Exception as e:
        return {"erro": str(e)}


# ===== INÍCIO DA APLICAÇÃO =====

eel.start("index.html", size=(1280, 720))
