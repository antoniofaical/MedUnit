import os
from backend.utils import (
    ler_json,
    salvar_json,
    agora_formatado,
    estimar_estoque,
    gerar_modulo_vazio,
)

CAMINHO_MODULOS = "dados/modulos"


# Retorna lista de todos os módulos registrados
def listar_modulos() -> list[str]:
    if not os.path.exists(CAMINHO_MODULOS):
        return []
    return [
        nome.replace(".json", "")
        for nome in os.listdir(CAMINHO_MODULOS)
        if nome.endswith(".json")
    ]


# Carrega o JSON de um módulo específico
def carregar_modulo(mod_id: str) -> dict:
    caminho = os.path.join(CAMINHO_MODULOS, f"{mod_id}.json")
    return ler_json(caminho)


# Salva o JSON de um módulo específico
def salvar_modulo(mod_id: str, dados: dict) -> None:
    caminho = os.path.join(CAMINHO_MODULOS, f"{mod_id}.json")
    dados["ultima_atualizacao"] = agora_formatado()
    salvar_json(caminho, dados)


# Limpa os dados de um módulo, preservando o ID
def limpar_modulo(mod_id: str) -> None:
    caminho = os.path.join(CAMINHO_MODULOS, f"{mod_id}.json")
    dados_vazios = gerar_modulo_vazio(mod_id)
    salvar_json(caminho, dados_vazios)


# Atualiza o estoque estimado de um módulo com base na posologia e tempo
def atualizar_estoque(mod_id: str) -> int:
    dados = carregar_modulo(mod_id)
    novo_estoque = estimar_estoque(dados)
    dados["estoque_atual"] = novo_estoque
    salvar_modulo(mod_id, dados)
    return novo_estoque
