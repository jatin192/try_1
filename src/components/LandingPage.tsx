import React from 'react';
import Footer from './Footer';
import CyberAadhaarAnimation from './CyberAadhaarAnimation';

interface LandingPageProps {
  onLaunchApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  return (
    <div className="min-h-screen bg-[#0a1929] text-white">
      {/* Header */}
      <header className="bg-[#0a1929]/80 backdrop-blur-md border-b border-blue-500/10 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <img src="/logo.svg" alt="Logo" className="h-10 w-10 relative" />
              </div>
              <span className="font-bold text-2xl text-white group-hover:text-blue-400 transition-all duration-300">
                ZK Aadhaar
              </span>
            </div>
            <button
              onClick={onLaunchApp}
              className="inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105"
            >
              Launch App →
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929] via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4 animate-slideIn">
                <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
                  <span className="block text-gray-200">
                    Secure Identity
                  </span>
                  <span className="block text-gray-200">
                    Verification
                  </span>
                  <span className="block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mt-2">
                    with Zero Knowledge
                  </span>
                </h1>
                <p className="mt-6 text-lg text-gray-400 animate-fadeIn leading-relaxed max-w-2xl mx-auto lg:mx-0" style={{ animationDelay: '0.3s' }}>
                  Experience the future of identity verification. Verify your Aadhaar securely while maintaining 
                  complete privacy through advanced zero-knowledge proofs.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 animate-scaleIn" style={{ animationDelay: '0.6s' }}>
                <button
                  onClick={onLaunchApp}
                  className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started Now
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
                <a
                  href="#features"
                  className="group inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full text-gray-300 border border-gray-700 hover:border-blue-500 hover:text-blue-400 transition-all duration-300 hover:scale-105"
                >
                  Learn More
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="relative lg:order-last animate-fadeIn" style={{ animationDelay: '0.9s' }}>
              <CyberAadhaarAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose ZK Aadhaar?</h2>
            <p className="text-xl text-gray-400">Experience the future of identity verification</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Privacy First",
                description: "Your personal information stays with you. Only zero-knowledge proofs are shared.",
                icon: "🔒"
              },
              {
                title: "Fast & Efficient",
                description: "Quick verification process with minimal computational overhead.",
                icon: "⚡"
              },
              {
                title: "Decentralized",
                description: "No central authority or data storage. Complete control over your identity.",
                icon: "🌐"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative p-8 bg-[#0a1929] ring-1 ring-gray-700/50 rounded-lg leading-none space-y-6">
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
