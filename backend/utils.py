import json
import os
from datetime import datetime
from typing import Any
import re
import logging

logging.basicConfig(level=logging.INFO)


# Define a variavel config_path globalmente
def config_path() -> str:
    return os.path.join("dados", "config.json")


# Define a variavel modulos_path globalmente
def modulos_path() -> str:
    return os.path.join("dados", "modulos")


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


def salvar_json(caminho: str, dados: dict) -> None:
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=4, ensure_ascii=False)
    logging.info(f"[SALVO] Arquivo JSON salvo com sucesso: {caminho}")


# Formata um objeto datetime para string legível. Formato padrão: DD/MM/AAAA HH:MM
def formatar_data(data_obj: datetime, formato: str = "%d/%m/%Y %H:%M") -> str:
    return data_obj.strftime(formato)


# Retorna a data/hora atual formatada.
def agora_formatado() -> str:
    return formatar_data(datetime.now())


# Valida módulo com todas as chaves mínimas esperadas. Útil para prevenir salvamento corrompido
def validar_modulo_json(dados: dict) -> bool:
    obrigatorios = ["id", "paciente", "medicamento", "horarios"]
    ausentes = [k for k in obrigatorios if k not in dados]
    if ausentes:
        raise ValueError(f"Campos obrigatórios ausentes no módulo: {ausentes}")
    return True


# Gera módulo com todos os campos esperadas. Útil para limpar/registrar módulo
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
