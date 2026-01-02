'use client';

interface TransactionHistoryItem {
  type: 'tip' | 'subscription' | 'checkin';
  hash: string;
  timestamp: Date;
  details: string;
  amount?: string;
}

interface TransactionHistoryProps {
  transactions: TransactionHistoryItem[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getTypeIcon = (type: TransactionHistoryItem['type']) => {
    switch (type) {
      case 'tip':
        return '💸';
      case 'subscription':
        return '⭐';
      case 'checkin':
        return '✅';
      default:
        return '📝';
    }
  };

  const getTypeColor = (type: TransactionHistoryItem['type']) => {
    switch (type) {
      case 'tip':
        return 'text-green-400';
      case 'subscription':
        return 'text-purple-400';
      case 'checkin':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 text-center">
        <p className="text-gray-400">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-gray-700">
        {transactions.map((tx, index) => (
          <div key={index} className="p-4 hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTypeIcon(tx.type)}</span>
                <div>
                  <p className={`font-medium ${getTypeColor(tx.type)}`}>
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                  </p>
                  <p className="text-sm text-gray-400">{tx.details}</p>
                </div>
              </div>
              <div className="text-right">
                {tx.amount && (
                  <p className="text-white font-medium">{tx.amount} ETH</p>
                )}
                <a
                  href={`https://basescan.org/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
