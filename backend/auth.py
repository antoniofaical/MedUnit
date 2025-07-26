import os
import json
import bcrypt
from backend.utils import limpa_string, salvar_json, config_path

CONFIG_PATH = config_path()


# Gera e retorna um hash seguro para uma senha fornecida
def criar_hash(senha: str) -> str:
    return bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


# Lê e retorna os dados do config.json
def carregar_config():
    if not os.path.exists(CONFIG_PATH):
        raise FileNotFoundError("Arquivo config.json não encontrado.")

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


# Salva um dicionário como config.json
def salvar_config(config: dict) -> None:
    os.makedirs("dados", exist_ok=True)
    salvar_json(CONFIG_PATH, config)


# Cria config.json a partir de dados brutos de entrada
def criar_config(cnpj: str, nome_farmacia: str, senha: str, plano: str = "empresarial") -> None:
    
    config = {
        "cnpj": limpa_string(cnpj, tipo="cnpj"),
        "nome_farmacia": limpa_string(nome_farmacia, tipo="nome"),
        "senha": criar_hash(limpa_string(senha, tipo="senha")),
        "plano": plano,
    }

    salvar_config(config)


# Verifica se o CNPJ e a senha informados correspondem aos dados em config.json
def verificar_login(cnpj_digitado: str, senha_digitada: str) -> bool:
    cnpj = limpa_string(cnpj_digitado, tipo="cnpj")
    senha = limpa_string(senha_digitada, tipo="senha")

    try:
        config = carregar_config()

    except FileNotFoundError:
        return False

    if cnpj != config.get("cnpj"):
        return False

    senha_hash = config.get("senha", "").encode("utf-8")
    return bcrypt.checkpw(senha.encode("utf-8"), senha_hash)
