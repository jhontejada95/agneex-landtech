from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware

RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc"
w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)

print(f"Web3 eth attributes: {[a for a in dir(w3.eth) if not a.startswith('_')]}")

try:
    print(f"max_priority_fee_per_gas: {w3.eth.max_priority_fee_per_gas}")
except Exception as e:
    print(f"max_priority_fee_per_gas failed: {e}")

try:
    # Emular estimación de gas básica
    base_fee = w3.eth.get_block("latest")["baseFeePerGas"]
    print(f"base_fee: {base_fee}")
except Exception as e:
    print(f"base_fee failed: {e}")
