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
async def encontrar_dispositivo(nome_esperado):
    print("🔍 Escaneando BLE...")
    dispositivos = await BleakScanner.discover()

    for d in dispositivos:
        print("👀 Visto:", d.name)
        if d.name == nome_esperado:
            return d

    print("⚠️ Dispositivo não encontrado.")
    return None


# ===== CONEXÃO BLE - LEITURA =====
# bluetooth.py

async def conectar_modulo_async(mod_id: str) -> dict:
    print(f"🔍 Procurando dispositivo: MedUnit_{mod_id}")
    nome_dispositivo = f"MedUnit_{mod_id}"
    dispositivo = await encontrar_dispositivo(nome_dispositivo)

    if not dispositivo:
        print("❌ Dispositivo não encontrado.")
        return {"erro": "Dispositivo não encontrado"}

    print(f"✅ Dispositivo encontrado: {dispositivo.address}")
    async with BleakClient(dispositivo) as client:
        print("🔗 Conectado com sucesso!")

        if not client.is_connected:
            print("❌ Conexão BLE falhou.")
            return {"erro": "Falha na conexão"}

        print("🔐 Enviando token de autenticação...")
        await client.write_gatt_char(CHARACTERISTIC_UUID, AUTH_TOKEN_1.encode())
        await asyncio.sleep(3.0)


        resposta = await client.read_gatt_char(CHARACTERISTIC_UUID)
        await asyncio.sleep(0.5)

        if not resposta:
            print("❌ Nenhuma resposta de autenticação recebida.")
            return {"erro": "Sem resposta da ESP"}

        resposta_str = resposta.decode()
        print("🔓 Resposta da ESP:", resposta_str)

        if resposta_str != AUTH_TOKEN_2:
            print("❌ Token inválido.")
            return {"erro": "Autenticação falhou"}

        print("📦 Solicitando JSON com READ_JSON...")
        await client.write_gatt_char(CHARACTERISTIC_UUID, b"READ_JSON")
        await asyncio.sleep(3.0)

        json_bytes = await client.read_gatt_char(CHARACTERISTIC_UUID)
        await asyncio.sleep(0.5)


        if not json_bytes:
            print("❌ Nenhum JSON retornado pela ESP.")
            return {"erro": "ESP não retornou JSON"}

        json_texto = json_bytes.decode()
        print("📥 JSON recebido:", json_texto)

        try:
            json_obj = json.loads(json_texto)
            print("✅ JSON parseado com sucesso.")
            return json_obj
        except json.JSONDecodeError as e:
            print(f"❌ Erro ao decodificar JSON: {e}")
            return {"erro": "JSON inválido"}

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
        await asyncio.sleep(3.0)


        # Etapa 2: Receber AUTH_TOKEN_2
        resposta = await client.read_gatt_char(CHARACTERISTIC_UUID)
        await asyncio.sleep(0.5)

        if resposta.decode() != AUTH_TOKEN_2:
            raise Exception("Autenticação falhou")

        # Etapa 3: Enviar JSON
        json_texto = json.dumps(json_data)
        await client.write_gatt_char(CHARACTERISTIC_UUID, json_texto.encode())
        await asyncio.sleep(3.0)

        return True