from .client import BinanceClientManager
from datetime import datetime
from decimal import Decimal

class BinanceTradingService:
    def __init__(self):
        self.client_manager = BinanceClientManager()
    
    def get_trade_history(self, symbol=None, limit=500):
        """Get trade history for all symbols or specific symbol"""
        client = self.client_manager.get_client()
        
        try:
            if symbol:
                # Get trades for specific symbol
                trades = client.get_my_trades(symbol=symbol, limit=limit)
                return self._format_trades(trades)
            else:
                # Get all trades for all symbols
                all_trades = []
                # Get account info to find traded symbols
                account = client.get_account()
                
                # Get exchange info to find all symbols
                exchange_info = client.get_exchange_info()
                
                print("🔄 Fetching trade history for all symbols...")
                for symbol_info in exchange_info['symbols']:
                    symbol = symbol_info['symbol']
                    try:
                        trades = client.get_my_trades(symbol=symbol, limit=100)
                        if trades:
                            all_trades.extend(self._format_trades(trades))
                            print(f"📊 Found {len(trades)} trades for {symbol}")
                    except Exception as e:
                        # Skip symbols with no trades
                        continue
                
                return all_trades
        
        except Exception as e:
            print(f"❌ Error getting trade history: {e}")
            return []
    
    def _format_trades(self, trades):
        """Format trades to match database schema"""
        formatted_trades = []
        
        for trade in trades:
            formatted_trade = {
                'binance_order_id': trade['orderId'],
                'binance_trade_id': trade['id'],
                'symbol': trade['symbol'],
                'side': 'BUY' if trade['isBuyer'] else 'SELL',
                'quantity': Decimal(trade['qty']),
                'price': Decimal(trade['price']),
                'quote_quantity': Decimal(trade['quoteQty']),
                'commission': Decimal(trade['commission']),
                'commission_asset': trade['commissionAsset'],
                'executed_at': datetime.fromtimestamp(trade['time'] / 1000),
                'is_maker': trade['isMaker']
            }
            formatted_trades.append(formatted_trade)
        
        return formatted_trades