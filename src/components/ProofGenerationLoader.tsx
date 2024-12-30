import React, { useEffect, useState } from 'react';

interface Props {
  width?: number;
  height?: number;
  spinnerSize?: number;
}

const ProofGenerationLoader: React.FC<Props> = ({
  width = 400,
  height = 300,
  spinnerSize = 60,
}) => {
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  const [currentHash, setCurrentHash] = useState('');

  // Generate matrix characters
  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
    const columns = 20;
    let interval: NodeJS.Timeout;

    const generateColumn = () => {
      const columnLength = Math.floor(Math.random() * 15) + 5;
      return Array(columnLength).fill(0).map(() => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
    };

    const updateMatrix = () => {
      const newMatrix = Array(columns).fill(0).map(generateColumn);
      setMatrixChars(newMatrix);
    };

    interval = setInterval(updateMatrix, 100);
    return () => clearInterval(interval);
  }, []);

  // Generate hash animation
  useEffect(() => {
    const chars = '0123456789abcdef';
    let interval: NodeJS.Timeout;

    const generateHash = () => {
      let hash = '0x';
      for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * chars.length)];
      }
      setCurrentHash(hash);
    };

    interval = setInterval(generateHash, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="flex flex-col items-center justify-center gap-8 text-center animate-fadeIn"
      style={{ width, height }}
    >
      {/* Matrix Animation Container */}
      <div className="relative w-96 h-96 bg-[#0a1929] rounded-lg overflow-hidden border border-blue-500/10">
        {/* Background Matrix Effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-20 gap-1 p-2 font-mono text-xs leading-none text-cyan-500">
            {matrixChars.map((col, idx) => (
              <div key={idx} className="animate-matrix-fall overflow-hidden whitespace-nowrap">
                {col}
              </div>
            ))}
          </div>
        </div>

        {/* Central Hash Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm">
          {/* Spinning Hexagon */}
          <div className="relative w-32 h-32 mb-4">
            <div className="absolute inset-0 animate-spin-slow">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon 
                  points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-cyan-500"
                />
              </svg>
            </div>
            <div className="absolute inset-0 animate-spin-reverse">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon 
                  points="50,10 86.6,30 86.6,70 50,90 13.4,70 13.4,30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-cyan-400 opacity-50"
                />
              </svg>
            </div>
          </div>

          {/* Hash Display */}
          <div className="text-center">
            <div className="font-mono text-sm text-cyan-400 mb-2">Generating Zero Knowledge Proof</div>
            <div className="font-mono text-sm text-cyan-400 mb-2">using your device's CPU...</div>
            <div className="font-mono text-xs text-cyan-500/70 break-all px-4">
              {currentHash}
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="text-center space-y-2">

        <p className="text-sm text-gray-400">• MacBook Pro M1 (16GB): ~26 seconds</p>
        <p className="text-sm text-gray-400">• Standard Laptop: 1-2 minutes</p>
      </div>

      
    </div>
  );
};

export default ProofGenerationLoader;