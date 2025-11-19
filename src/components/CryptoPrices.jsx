import { useState, useEffect, memo } from 'react';

const CryptoPrices = memo(() => {
  const [prices, setPrices] = useState({
    BTC: { price: 96084.50, change: 2.45 },
    ETH: { price: 3210.25, change: -1.23 },
    SOL: { price: 142.61, change: 5.67 },
    BNB: { price: 942.91, change: 0.89 }
  });

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(symbol => {
          const change = (Math.random() - 0.5) * 0.5; // Small random change
          updated[symbol] = {
            price: updated[symbol].price * (1 + change / 100),
            change: updated[symbol].change + change
          };
        });
        return updated;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(4);
  };

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <div className="w-full bg-stone/50 dark:bg-ink/50 backdrop-blur-sm border-b border-ink/20 dark:border-stone/20">
      <div className="container mx-auto max-w-7xl px-4 md:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4 md:gap-8">
          {Object.entries(prices).map(([symbol, data]) => (
            <div key={symbol} className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-ink dark:text-stone">{symbol}</span>
              <span className="font-mono text-sm text-ink/80 dark:text-stone/80">
                ${formatPrice(data.price)}
              </span>
              <span
                className={`font-mono text-xs font-bold ${
                  data.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {formatChange(data.change)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

CryptoPrices.displayName = 'CryptoPrices';

export default CryptoPrices;

