from binance.client import Client
from binance.exceptions import BinanceAPIException
import os
from dotenv import load_dotenv

load_dotenv()

class BinanceClientManager:
    def __init__(self):
        self.api_key = os.getenv('BINANCE_API_KEY')
        self.secret_key = os.getenv('BINANCE_SECRET_KEY')
        self.testnet = os.getenv('BINANCE_TESTNET', 'True').lower() == 'true'
        self.client = None
    
    def connect(self):
        """Initialize Binance client connection"""
        try:
            self.client = Client(
                self.api_key, 
                self.secret_key,
                testnet=self.testnet
            )
            # Test connection
            account_info = self.client.get_account()
            print(f"✅ Connected to Binance {'Testnet' if self.testnet else 'Mainnet'}")
            return True
        except Exception as e:
            print(f"❌ Binance connection failed: {e}")
            return False
    
    def get_client(self):
        """Get the Binance client instance"""
        if not self.client:
            self.connect()
        return self.client