# bluetooth.py
import json
import asyncio
from bleak import BleakClient, BleakScanner

# ===== CONFIGURAÇÕES GERAIS =====
SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8"

# ===== HANDSHAKE =====
AUTH_TOKEN_1 = "medunit_auth1"
AUTH_TOKEN_2 = "medunit_auth2"

# ===== FUNÇÃO AUXILIAR =====
async def encontrar_dispositivo(nome_esperado: str):
    dispositivos = await BleakScanner.discover(timeout=5.0)
    for d in dispositivos:
        if nome_esperado in d.name:
            return d
    return None

# ===== CONEXÃO BLE - LEITURA =====
async def conectar_modulo_async(mod_id: str) -> dict:
    nome_dispositivo = f"MedUnit_{mod_id}"
    dispositivo = await encontrar_dispositivo(nome_dispositivo)
    if not dispositivo:
        raise Exception("Dispositivo não encontrado")

    async with BleakClient(dispositivo) as client:
        if not client.is_connected:
            raise Exception("Falha na conexão")

        # Etapa 1: Enviar AUTH_TOKEN_1
        await client.write_gatt_char(CHARACTERISTIC_UUID, AUTH_TOKEN_1.encode())

        # Etapa 2: Receber AUTH_TOKEN_2
        resposta = await client.read_gatt_char(CHARACTERISTIC_UUID)
        if resposta.decode() != AUTH_TOKEN_2:
            raise Exception("Autenticação falhou")

        # Etapa 3: Solicitar JSON
        await client.write_gatt_char(CHARACTERISTIC_UUID, b"READ_JSON")
        json_bytes = await client.read_gatt_char(CHARACTERISTIC_UUID)
        json_texto = json_bytes.decode()
        return json.loads(json_texto)

# ===== CONEXÃO BLE - ESCRITA =====
async def enviar_json_para_modulo_async(mod_id: str, json_data: dict) -> bool:
    nome_dispositivo = f"MedUnit_{mod_id}"
    dispositivo = await encontrar_dispositivo(nome_dispositivo)
    if not dispositivo:
        raise Exception("Dispositivo não encontrado")

    async with BleakClient(dispositivo) as client:
        if not client.is_connected:
            raise Exception("Falha na conexão")

        # Etapa 1: Enviar AUTH_TOKEN_1
        await client.write_gatt_char(CHARACTERISTIC_UUID, AUTH_TOKEN_1.encode())

        # Etapa 2: Receber AUTH_TOKEN_2
        resposta = await client.read_gatt_char(CHARACTERISTIC_UUID)
        if resposta.decode() != AUTH_TOKEN_2:
            raise Exception("Autenticação falhou")

        # Etapa 3: Enviar JSON
        json_texto = json.dumps(json_data)
        await client.write_gatt_char(CHARACTERISTIC_UUID, json_texto.encode())
        return True