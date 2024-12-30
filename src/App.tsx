import {
  AnonAadhaarProof,
  useAnonAadhaar,
  useProver,
} from "@anon-aadhaar/react";
import { useEffect, useState, useCallback } from "react";
import { BlockchainService } from "./services/BlockchainService";
import { ProofStatus } from "./components/ProofStatus";
import { ethers } from "ethers";
import ProofGenerationLoader from "./components/ProofGenerationLoader";
import AnonAadhaarWrapper from "./components/AnonAadhaarWrapper";
import ProofVerifier from "./components/ProofVerifier";
import LandingPage from "./components/LandingPage";

// const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const CONTRACT_ADDRESS= "0xA2DD8Fe6933120bF47B2130A46010519C1ef5460";
export default function App() {
  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proofHistory, setProofHistory] = useState<any[]>([]);
  const [blockchainService, setBlockchainService] = useState<BlockchainService | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [networkName, setNetworkName] = useState<string>("");
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [mode, setMode] = useState<'generate' | 'verify' | null>(null);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const initializeBlockchainService = async () => {
      try {
        if (window.ethereum) {
          setIsMetaMaskInstalled(true);
          const service = new BlockchainService(CONTRACT_ADDRESS);
          setBlockchainService(service);
          setCurrentStep(2); // Set to connect wallet step if MetaMask is installed
        } else {
          setIsMetaMaskInstalled(false);
          console.error('MetaMask is not installed');
        }
      } catch (error) {
        console.error('Error initializing blockchain service:', error);
      }
    };

    initializeBlockchainService();
  }, []);

  // Update network name
  const updateNetworkName = useCallback(async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      setNetworkName(network.name);
    }
  }, []);

  // Check initial connection and set up listeners
  useEffect(() => {
    if (!blockchainService) return;

    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            const address = accounts[0];
            setWalletAddress(address);
            setCurrentStep(3);
            await updateNetworkName();
          }
        }
      } catch (err) {
        console.error('Connection check error:', err);
      }
    };

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setCurrentStep(3);
      } else {
        setWalletAddress(null);
        setCurrentStep(2);
      }
    };

    const handleNetworkChanged = async () => {
      await updateNetworkName();
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleNetworkChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleNetworkChanged);
      }
    };
  }, [blockchainService, updateNetworkName]);

  const handleConnectWallet = async () => {
    try {
      setError(null);
      if (!blockchainService) {
        throw new Error('Blockchain service not initialized');
      }

      const address = await blockchainService.connectWallet();
      setWalletAddress(address);
      setCurrentStep(3);
      await updateNetworkName();
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    }
  };

  useEffect(() => {
    const handleProofGeneration = async () => {
      if (!blockchainService) return;

      if (anonAadhaar.status === "logging-in") {
        setIsGeneratingProof(true);
        setError(null);
      } else if (anonAadhaar.status === "logged-in" && latestProof) {
        setIsGeneratingProof(false);
        setCurrentStep(4);
        
        try {
          setCurrentStep(5);
          setIsLoading(true);
          const result = await blockchainService.submitProof(latestProof);
          setTransactionHash(result.transactionHash);
          setProofHistory(prev => [...prev, latestProof]);
          setIsLoading(false);
          
          // Show message if proof already exists (when transactionHash is empty)
          if (!result.transactionHash) {
            setError("Proof already exists on the blockchain. No need to store again.");
          }
        } catch (err: any) {
          setError("Failed to store proof on blockchain. Please try again.");
          setIsLoading(false);
        }
      } else if (anonAadhaar.status === "error") {
        setIsGeneratingProof(false);
        setError("Failed to verify identity. Please try again.");
      }
    };

    handleProofGeneration();
  }, [anonAadhaar.status, latestProof, blockchainService]);

  const renderStep = (stepNumber: number, title: string, isComplete: boolean) => {
    let status = "";
    if (stepNumber === 4 && currentStep === 4) {
      status = "Proof Generated";
    } else if (stepNumber === 5 && currentStep === 5 && !transactionHash) {
      status = "Storing on Blockchain...";
    } else if (stepNumber === 5 && transactionHash) {
      status = "Stored Successfully";
    }

    return (
      <div className="flex items-center gap-4 relative">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center relative z-10
          ${currentStep === stepNumber ? 'bg-cyan-500 text-white ring-2 ring-cyan-500/20 ring-offset-2 ring-offset-[#0a1929]' :
            isComplete ? 'bg-green-500 text-white' : 'bg-[#0c1f35] text-gray-400 border border-blue-500/20'}
          transition-all duration-300
        `}>
          {isComplete ? '✓' : stepNumber}
        </div>
        <div className="flex flex-col">
          <span className={`${currentStep === stepNumber ? 'text-cyan-400 font-semibold' : isComplete ? 'text-gray-200' : 'text-gray-400'} transition-colors`}>
            {title}
          </span>
          {status && (
            <span className={`text-sm ${
              status.includes('Successfully') ? 'text-green-400' :
              status.includes('Generated') ? 'text-cyan-400' :
              'text-gray-400'
            }`}>
              {status}
            </span>
          )}
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    setProofHistory([]);
    setTransactionHash(null);
    setCurrentStep(isMetaMaskInstalled ? 2 : 1);
  };

  const handleDownloadProof = () => {
    if (!latestProof || !transactionHash) return;

    const proofData = {
      proof: latestProof,
      transactionHash,
      timestamp: Date.now(),
      network: networkName,
      contract: CONTRACT_ADDRESS
    };

    const blob = new Blob([JSON.stringify(proofData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anon-aadhaar-proof-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {!showApp ? (
        <LandingPage onLaunchApp={() => setShowApp(true)} />
      ) : (
        <div className="min-h-screen bg-[#0a1929] text-gray-200">
          {/* Header */}
          <header className="bg-[#0a1929]/80 backdrop-blur-md border-b border-blue-500/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <h1 className="text-xl font-bold text-gray-200">ZK Aadhaar Verification</h1>
                <button
                  onClick={() => setShowApp(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {!mode ? (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">Choose an Option</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Option 1 */}
                  <div 
                    onClick={() => setMode('generate')}
                    className="group relative cursor-pointer"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                    <div className="relative p-8 bg-[#0c1f35] rounded-lg border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300">
                      <h3 className="text-xl font-semibold mb-4 text-gray-200 group-hover:text-cyan-400 transition-colors">Option 1: New User</h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        Generate a new anonymous proof using your Aadhaar card and store it on-chain.
                      </p>
                    </div>
                  </div>

                  {/* Option 2 */}
                  <div 
                    onClick={() => setMode('verify')}
                    className="group relative cursor-pointer"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                    <div className="relative p-8 bg-[#0c1f35] rounded-lg border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300">
                      <h3 className="text-xl font-semibold mb-4 text-gray-200 group-hover:text-cyan-400 transition-colors">Option 2: Verify Existing Proof</h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        Verify an existing proof by uploading the JSON file and checking its validity on-chain.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : mode === 'generate' ? (
              <div className="space-y-8">
                <div>
                  <button
                    onClick={() => setMode(null)}
                    className="text-gray-400 hover:text-gray-200 transition-colors flex items-center gap-2 mb-8"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Options
                  </button>

                  {/* Steps */}
                  <div className="relative">
                    <div className="absolute left-4 inset-y-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-cyan-500/50 to-transparent"></div>
                    <div className="relative space-y-6 pl-12">
                      {renderStep(1, "Install MetaMask", currentStep > 1)}
                      {renderStep(2, "Connect Wallet", currentStep > 2)}
                      {renderStep(3, "Provide Aadhaar QR", currentStep > 3)}
                      {renderStep(4, "Generate Proof", currentStep > 4)}
                      {renderStep(5, "Store on Blockchain", currentStep > 5)}
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <p className="text-gray-400">
                      Prove your Identity anonymously using your Aadhaar card.
                      Your proof will be securely stored on Sepolia testnet.
                    </p>

                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400">{error}</p>
                      </div>
                    )}

                    {!isMetaMaskInstalled && (
                      <div className="p-4 bg-[#0c1f35] rounded-lg border border-blue-500/10">
                        <p className="text-gray-300 mb-4">Please install MetaMask to continue</p>
                        <a
                          href="https://metamask.io/download/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Install MetaMask
                        </a>
                      </div>
                    )}

                    {isMetaMaskInstalled && !walletAddress && (
                      <button
                        onClick={handleConnectWallet}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        Connect Wallet
                      </button>
                    )}

                    {walletAddress && !isGeneratingProof && currentStep === 3 && (
                      <div className="space-y-4">
                        <div className="p-4 bg-[#0c1f35] rounded-lg border border-blue-500/10">
                          <p className="text-gray-300 mb-2">Connected Wallet:</p>
                          <p className="font-mono text-cyan-400 break-all">{walletAddress}</p>
                          <p className="text-gray-400 mt-2">Network: {networkName}</p>
                        </div>
                        <AnonAadhaarWrapper
                          onProofGenerated={() => {
                            setIsGeneratingProof(true);
                          }}
                          onVerify={() => {
                            setCurrentStep(4);
                          }}
                          onError={(error) => {
                            setError(error.message);
                            setIsGeneratingProof(false);
                          }}
                        />
                      </div>
                    )}

                    {isGeneratingProof && (
                      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
                        <div className="bg-[#0a1929] rounded-lg p-8 mx-4 border border-blue-500/20">
                          <ProofGenerationLoader />
                        </div>
                      </div>
                    )}

                    {anonAadhaar.status === "logged-in" && (
                      <div className="space-y-6">
                        <div className="p-6 bg-[#0c1f35] rounded-lg border border-blue-500/10">
                          <ProofStatus 
                            status="success"
                            proofHash={latestProof ? ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(latestProof))) : undefined}
                            transactionHash={transactionHash || undefined}
                            timestamp={Date.now() / 1000}
                          />

                          {latestProof && transactionHash && (
                            <div className="flex gap-4 mt-6">
                              <button
                                onClick={handleDownloadProof}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Download Proof
                              </button>

                              <button
                                onClick={() => {
                                  handleLogout();
                                  setMode(null);
                                }}
                                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all duration-300"
                              >
                                Start New Verification
                              </button>
                            </div>
                          )}
                        </div>

                        {latestProof && (
                          <div className="p-6 bg-[#0c1f35] rounded-lg border border-blue-500/10">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-semibold text-gray-200">Proof Details</h3>
                              {transactionHash && (
                                <a
                                  href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2"
                                >
                                  <span>View on Etherscan</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                  </svg>
                                </a>
                              )}
                            </div>
                            <div className="bg-[#0a1929] rounded-lg p-4 border border-blue-500/10">
                              <AnonAadhaarProof code={JSON.stringify(latestProof, null, 2)} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {isLoading && !isGeneratingProof && (
                      <div className="flex flex-col items-center gap-3 p-6 bg-[#0c1f35] rounded-lg border border-blue-500/10">
                        <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                        <p className="text-gray-300">Processing blockchain transaction...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setMode(null)}
                  className="text-gray-400 hover:text-gray-200 transition-colors flex items-center gap-2 mb-8"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Options
                </button>

                <ProofVerifier blockchainService={blockchainService} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
