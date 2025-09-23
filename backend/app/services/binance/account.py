from .client import BinanceClientManager
from decimal import Decimal

class BinanceAccountService:
    def __init__(self):
        self.client_manager = BinanceClientManager()
    
    def get_account_info(self):
        """Get account information"""
        client = self.client_manager.get_client()
        try:
            account = client.get_account()
            return {
                'account_type': account.get('accountType'),
                'can_trade': account.get('canTrade'),
                'can_withdraw': account.get('canWithdraw'),
                'can_deposit': account.get('canDeposit'),
                'update_time': account.get('updateTime'),
                'balances': account.get('balances', [])
            }
        except Exception as e:
            print(f"❌ Error getting account info: {e}")
            return None
    
    def get_balances(self):
        """Get all non-zero balances"""
        account_info = self.get_account_info()
        if not account_info:
            return []
        
        balances = []
        for balance in account_info['balances']:
            free = Decimal(balance['free'])
            locked = Decimal(balance['locked'])
            total = free + locked
            
            if total > 0:
                balances.append({
                    'asset': balance['asset'],
                    'free': free,
                    'locked': locked,
                    'total': total
                })
        
        return balances