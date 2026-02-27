import os
import json
from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware
from solcx import compile_standard, install_solc

# Configuración
RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc"
# IMPORTANTE: Esta es una llave de prueba de la billetera creada anteriormente
PRIVATE_KEY = "0xa70f9c3d3f284bcc007b65c10cae029e4649a13c1dff8b4d4287ae0deb88f3c6"
CONTRACT_PATH = "contracts/LandRegistry.sol"

def deploy():
    # 1. Instalar solc si no está
    print("Verificando solc...")
    install_solc("0.8.19")

    # 2. Leer contrato
    with open(CONTRACT_PATH, "r", encoding="utf-8") as file:
        land_registry_file = file.read()

    # 3. Compilar
    print("Compilando contrato...")
    compiled_sol = compile_standard(
        {
            "language": "Solidity",
            "sources": {CONTRACT_PATH: {"content": land_registry_file}},
            "settings": {
                "outputSelection": {
                    "*": {
                        "*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]
                    }
                }
            },
        },
        solc_version="0.8.19",
    )

    # 4. Obtener Bytecode y ABI
    bytecode = compiled_sol["contracts"][CONTRACT_PATH]["LandRegistry"]["evm"]["bytecode"]["object"]
    abi = compiled_sol["contracts"][CONTRACT_PATH]["LandRegistry"]["abi"]

    # 5. Conectar a Web3
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
    account = w3.eth.account.from_key(PRIVATE_KEY)
    print(f"Desplegando desde: {account.address}")
    
    if not w3.is_connected():
        raise Exception("Error: No se pudo conectar al RPC")

    # 6. Crear contrato
    LandRegistry = w3.eth.contract(abi=abi, bytecode=bytecode)

    # 7. Obtener parámetros de gas manuales (EIP-1559)
    print("Configurando gas...")
    latest_block = w3.eth.get_block("latest")
    base_fee = latest_block.get("baseFeePerGas", 100000000) # Fallback 0.1 gwei
    
    # Arbitrum Sepolia suele aceptar priority fees bajos
    priority_fee = Web3.to_wei(0.1, 'gwei') 
    max_fee = int(base_fee * 1.5) + priority_fee

    print(f"Gas: Base={base_fee}, Max={max_fee}, Priority={priority_fee}")

    # 8. Construir transacción
    nonce = w3.eth.get_transaction_count(account.address)
    transaction = LandRegistry.constructor().build_transaction(
        {
            "chainId": w3.eth.chain_id,
            "maxFeePerGas": max_fee,
            "maxPriorityFeePerGas": priority_fee,
            "from": account.address,
            "nonce": nonce,
        }
    )

    # 9. Firmar transacción
    print("Firmando transacción...")
    signed_txn = w3.eth.account.sign_transaction(transaction, private_key=PRIVATE_KEY)

    # 10. Enviar transacción
    print("Enviando transacción de despliegue...")
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    print(f"Transacción enviada: {tx_hash.hex()}")

    # 11. Esperar recibo
    print("Esperando confirmación...")
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"¡Contrato desplegado con éxito en: {tx_receipt.contractAddress}!")

    # Guardar info en .env y abi.json
    abi_path = "contracts/LandRegistry_abi.json"
    with open(abi_path, "w") as f:
        json.dump(abi, f)
    
    print(f"ABI guardado en {abi_path}")
    
    return tx_receipt.contractAddress

if __name__ == "__main__":
    try:
        addr = deploy()
        print(f"\n>>>> CONTRATO DESPLEGADO EN: {addr} <<<<")
    except Exception as e:
        print(f"Error en el despliegue: {e}")
        import traceback
        traceback.print_exc()
