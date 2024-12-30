import React from 'react';

interface ProofStatusProps {
  status: string;
  proofHash?: string;
  transactionHash?: string;
  timestamp?: number;
}

export const ProofStatus: React.FC<ProofStatusProps> = ({ 
  status, 
  proofHash, 
  transactionHash,
  timestamp 
}) => {
  return (
    <div className="w-full rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${
          status === 'success' ? 'bg-green-500' :
          status === 'pending' ? 'bg-yellow-500' :
          'bg-red-500'
        } ring-2 ring-offset-2 ring-offset-[#0c1f35] ${
          status === 'success' ? 'ring-green-500/20' :
          status === 'pending' ? 'ring-yellow-500/20' :
          'ring-red-500/20'
        }`} />
        <h3 className={`font-semibold ${
          status === 'success' ? 'text-green-400' :
          status === 'pending' ? 'text-yellow-400' :
          'text-red-400'
        }`}>
          {status === 'success' ? 'Proof Verified & Stored' :
           status === 'pending' ? 'Verifying Proof' :
           'Verification Failed'}
        </h3>
      </div>
      
      {proofHash && (
        <div className="flex flex-col gap-2 p-4 bg-[#0a1929] rounded-lg border border-blue-500/10">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Proof Hash</span>
            <span className="font-mono text-cyan-400">{`${proofHash.slice(0, 10)}...${proofHash.slice(-8)}`}</span>
          </div>
          
          {timestamp && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Timestamp</span>
              <span className="text-gray-300">{new Date(timestamp * 1000).toLocaleString()}</span>
            </div>
          )}
          
          {status === 'success' && transactionHash && (
            <div className="flex items-center justify-between pt-2 border-t border-blue-500/10">
              <span className="text-gray-400">Transaction</span>
              <a 
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
              >
                <span className="font-mono">{`${transactionHash.slice(0, 10)}...${transactionHash.slice(-8)}`}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
