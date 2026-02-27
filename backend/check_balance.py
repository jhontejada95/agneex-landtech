from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware
import sys

rpc_url = "https://sepolia-rollup.arbitrum.io/rpc"
w3 = Web3(Web3.HTTPProvider(rpc_url))

# Web3 v7 uses ExtraDataToPOAMiddleware for PoA chains
try:
    w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
    print("PoA Middleware injected")
except Exception as e:
    print(f"Middleware injection failed: {e}")

private_key = "0xa70f9c3d3f284bcc007b65c10cae029e4649a13c1dff8b4d4287ae0deb88f3c6"

try:
    account = w3.eth.account.from_key(private_key)
    print(f"Address: {account.address}")
    
    if w3.is_connected():
        print("Connected to Arbitrum Sepolia")
        balance_wei = w3.eth.get_balance(account.address)
        balance_eth = w3.from_wei(balance_wei, 'ether')
        print(f"Balance: {balance_eth} ETH")
    else:
        print("Failed to connect to RPC")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
