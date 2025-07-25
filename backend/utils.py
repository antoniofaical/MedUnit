import json
import os
from datetime import datetime
from typing import Any
import re


# Limpeza de string para evitar scripts, comandos ou caracteres perigosos.
def limpa_string(texto: str, tipo: str = "geral") -> str:
    # Remove qualquer coisa que não seja número
    if tipo == "cnpj":
        return re.sub(r"[^\d]", "", texto.strip())

    # Remove tags HTML, espaços extras, e permite apenas letras, números, espaços, hífens e underlines
    elif tipo == "nome":
        texto = re.sub(r"<.*?>", "", texto)
        return re.sub(r"[^\w\s\-_]", "", texto).strip()

    # Remove espaços extras e quebras de linha
    elif tipo == "senha":
        return texto.strip().replace("\n", "").replace("\r", "")

    # Remove tags HTML, espaços extras e caracteres perigosos comuns
    else:  # tipo geral
        texto = re.sub(r"<.*?>", "", texto)
        texto = re.sub(r"[\"'`;]", "", texto)
        return texto.strip()


# Lê um arquivo JSON e retorna os dados carregados. Lança FileNotFoundError se o arquivo não existir.
def ler_json(caminho: str) -> Any:
    if not os.path.exists(caminho):
        raise FileNotFoundError(f"Arquivo {caminho} não encontrado.")

    try:
        with open(caminho, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        raise ValueError(f"Erro ao carregar JSON em {caminho}: {e}")


# Salva os dados fornecidos em formato JSON no caminho especificado.
def salvar_json(caminho: str, dados: Any) -> None:
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=4, ensure_ascii=False)


# Formata um objeto datetime para string legível. Formato padrão: DD/MM/AAAA HH:MM
def formatar_data(data_obj: datetime, formato: str = "%d/%m/%Y %H:%M") -> str:
    return data_obj.strftime(formato)


# Retorna a data/hora atual formatada.
def agora_formatado() -> str:
    return formatar_data(datetime.now())


def validar_modulo_json(dados: dict) -> bool:
    chaves_obrigatorias = ["id", "paciente", "medicamento", "horarios"]

    return all(chave in dados for chave in chaves_obrigatorias)


def gerar_modulo_vazio(mod_id: str) -> dict:

    return {
        "id": mod_id,
        "paciente": "",
        "cpf": "",
        "medicamento": "",
        "dosagem": "",
        "formato": "",
        "quantidade": 0,
        "horarios": [],
        "estoque_atual": 0,
        "ultima_atualizacao": agora_formatado(),
    }


# Retorna estimativa de comprimidos restantes com base na última atualização e posologia.
def estimar_estoque(dados_modulo: dict) -> int:
    ultima_data_str = dados_modulo.get("ultima_atualizacao")
    try:
        ultima_data = datetime.strptime(ultima_data_str, "%d/%m/%Y %H:%M")
    except:
        return dados_modulo.get("estoque_atual", 0)

    dias_passados = (datetime.now() - ultima_data).days
    posologia_diaria = len(dados_modulo.get("horarios", []))
    quantidade_usada = dias_passados * posologia_diaria
    return max(0, dados_modulo.get("estoque_atual", 0) - quantidade_usada)
