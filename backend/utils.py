# utils.py
import json
import os
import bcrypt

# ====== CAMINHOS PADRÃO ======
CONFIG_PATH = "dados/config.json"
MODULOS_DIR = "dados/modulos/"

# ========== STORAGE ==========
def carregar_config() -> dict:
    if not os.path.exists(CONFIG_PATH):
        raise FileNotFoundError("Arquivo config.json não encontrado.")
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def salvar_config(config: dict) -> None:
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)

def carregar_modulo(mod_id: str) -> dict:
    caminho = os.path.join(MODULOS_DIR, f"{mod_id}.json")
    if not os.path.exists(caminho):
        raise FileNotFoundError(f"Módulo {mod_id} não encontrado.")
    with open(caminho, "r", encoding="utf-8") as f:
        return json.load(f)

def salvar_modulo(mod_id: str, dados: dict) -> None:
    caminho = os.path.join(MODULOS_DIR, f"{mod_id}.json")
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=2, ensure_ascii=False)

# ========== SECURITY ==========
def gerar_hash(senha: str) -> str:
    salt = bcrypt.gensalt()
    hash_ = bcrypt.hashpw(senha.encode("utf-8"), salt)
    return hash_.decode("utf-8")

def verificar_senha(senha: str, hash_armazenado: str) -> bool:
    return bcrypt.checkpw(senha.encode("utf-8"), hash_armazenado.encode("utf-8"))
