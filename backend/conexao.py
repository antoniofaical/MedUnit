import asyncio
import json
from bleak import BleakClient, BleakScanner

# UUID da characteristic BLE que troca dados com o módulo
CHAR_JSON_UUID = "0000a001-0000-1000-8000-00805f9b34fb"

# Scan e retorna lista de dispositivos BLE próximos (filtra os MedUnit)
async def listar_dispositivos_BT():
    dispositivos = await BleakScanner.discover(timeout=5.0)
    encontrados = []
    for d in dispositivos:
        if "MedUnit" in (d.name or ""):
            encontrados.append({"nome": d.name, "endereco": d.address})
    return encontrados


# Testa conexão com o módulo a partir do MAC address
async def conectar_modulo(mac_address: str) -> bool:
    try:
        async with BleakClient(mac_address, timeout=10.0) as client:
            return await client.is_connected()
    except Exception as e:
        print(f"[ERRO] Conexão falhou com {mac_address}: {e}")
        return False


# Lê o JSON atual do módulo via comando GET_JSON
async def ler_json_do_modulo(mac_address: str) -> str:
    return await enviar_comando(mac_address, "GET_JSON")


# Envia um JSON atualizado para o módulo com comando SET_JSON
async def enviar_json_para_modulo(mac_address: str, json_dict: dict) -> str:
    comando = "SET_JSON:" + json.dumps(json_dict)
    return await enviar_comando(mac_address, comando)


# Envia um comando genérico e lê a resposta, se necessário
async def enviar_comando(mac_address: str, comando: str) -> str:
    try:
        async with BleakClient(mac_address, timeout=10.0) as client:
            await client.write_gatt_char(CHAR_JSON_UUID, comando.encode())

            # Sempre espera uma resposta curta (ACK ou JSON)
            resposta = await client.read_gatt_char(CHAR_JSON_UUID)
            return resposta.decode()

    except Exception as e:
        print(f"[ERRO] Falha ao enviar comando '{comando}' para {mac_address}: {e}")
        return "ERRO"

