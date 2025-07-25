import os
import json
import bcrypt

CONFIG_PATH = "./dados/config.json"


# Gera e retorna um hash seguro para uma senha fornecida
def criar_hash(senha: str) -> str:
    return bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


# Lê e retorna os dados do config.json
def carregar_config():
    if not os.path.exists(CONFIG_PATH):
        raise FileNotFoundError("Arquivo config.json não encontrado.")

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


# Verifica se o CNPJ e a senha informados correspondem aos dados em config.json
def verificar_login(cnpj_digitado: str, senha_digitada: str) -> bool:
    try:
        config = carregar_config()

    except FileNotFoundError:
        return False

    if cnpj_digitado != config.get("cnpj"):
        return False

    senha_hash = config.get("senha", "").encode("utf-8")
    return bcrypt.checkpw(senha_digitada.encode("utf-8"), senha_hash)
