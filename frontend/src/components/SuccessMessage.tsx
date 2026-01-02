'use client';

interface SuccessMessageProps {
  message: string;
  txHash?: string;
  onClose?: () => void;
}

export function SuccessMessage({ message, txHash, onClose }: SuccessMessageProps) {
  return (
    <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-green-400 text-sm">{message}</p>
          {txHash && (
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-green-300 hover:text-green-100 underline"
            >
              View transaction →
            </a>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-green-400 hover:text-green-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
