import React from 'react';

const CyberAadhaarAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-[600px] bg-[#0a1929] rounded-3xl overflow-hidden">
      {/* Background Grid and Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-cyber opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-transparent to-transparent"></div>
      </div>

      {/* Animated Lines */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 cyber-line"
            style={{
              top: `${10 + i * 10}%`,
              animationDelay: `${i * 0.2}s`,
              left: '0',
              right: '0'
            }}
          ></div>
        ))}
      </div>

      {/* Central Aadhaar Card Container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] animate-float-card">
        {/* Glowing Background Circle */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-2xl animate-pulse-slow"></div>
        
        {/* Aadhaar Card */}
        <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-cyan-200/30">
          <div className="text-center text-sm font-bold text-cyan-900 mb-3">
            ANONYMOUS ZERO-KNOWLEDGE PROOF
          </div>
          
          <div className="flex gap-4">
            {/* Left Side - Photo */}
            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
            </div>
            
            {/* Right Side - Details */}
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>

          {/* Fingerprint */}
          <div className="absolute bottom-4 right-4 w-12 h-12">
            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg animate-scan"></div>
          </div>
        </div>
      </div>

      {/* Lock Icons */}
      <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-2 animate-float">
          <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>

      {/* Hexagon Security Icon */}
      <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2">
        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-2 animate-float" style={{ animationDelay: '0.5s' }}>
          <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      </div>

      {/* Data Points */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-cyan-500 rounded-full animate-data-point"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.3}s`
          }}
        />
      ))}

      {/* Binary Data Stream */}
      <div className="absolute right-0 top-0 bottom-0 w-48 overflow-hidden opacity-30">
        <div className="binary-rain font-mono text-xs text-cyan-500">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-binary-fall"
              style={{
                right: `${i * 12}px`,
                animationDelay: `${i * 0.2}s`,
                top: '-20px'
              }}
            >
              {Math.random().toString(2).substr(2, 8)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CyberAadhaarAnimation;
