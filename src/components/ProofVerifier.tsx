import React, { useState, useRef } from 'react';
import { BlockchainService } from '../services/BlockchainService';
import { ethers } from 'ethers';

interface ProofVerifierProps {
  blockchainService: BlockchainService | null;
}

const ProofVerifier: React.FC<ProofVerifierProps> = ({ blockchainService }) => {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [proofDetails, setProofDetails] = useState<any>(null);
  const [proofHash, setProofHash] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateProofHash = (proof: any): string => {
    return ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(JSON.stringify(proof))
    );
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !blockchainService) {
      setErrorMessage('Please connect your wallet first');
      return;
    }

    try {
      setVerificationStatus('loading');
      setErrorMessage('');
      setProofDetails(null);
      setProofHash('');

      // Initialize provider and check network first
      try {
        await blockchainService.initializeProvider();
      } catch (error: any) {
        throw new Error(error.message);
      }

      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const proofData = JSON.parse(content);

          // Validate proof format
          if (!proofData.proof || !proofData.proof.type || proofData.proof.type !== 'anon-aadhaar') {
            throw new Error('Invalid proof format. Must be an Anon Aadhaar proof.');
          }

          // Store proof details for display
          setProofDetails(proofData);

          // Calculate proof hash
          const hash = calculateProofHash(proofData.proof);
          setProofHash(hash);
          console.log('Calculated proof hash:', hash);

          try {
            // Check if proof exists on chain
            if (!blockchainService.contract) {
              throw new Error('Contract not initialized');
            }

            const exists = await blockchainService.contract.verifyProofExists(hash);
            console.log('Proof exists on chain:', exists);

            if (exists) {
              setVerificationStatus('success');
            } else {
              throw new Error('Proof not found on chain');
            }
          } catch (verifyError: any) {
            console.error('Verification error:', verifyError);
            setVerificationStatus('error');
            if (verifyError.message.includes('not found on chain')) {
              setErrorMessage('This proof has not been submitted to the blockchain yet.');
            } else {
              setErrorMessage(verifyError.message || 'Failed to verify proof');
            }
          }
        } catch (err: any) {
          console.error('Proof processing error:', err);
          setVerificationStatus('error');
          setErrorMessage(err.message || 'Failed to process proof');
        }
      };

      fileReader.readAsText(file);
    } catch (err: any) {
      console.error('File reading error:', err);
      setVerificationStatus('error');
      setErrorMessage(err.message || 'Failed to read proof file');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-[#0a1929] rounded-lg shadow-lg border border-blue-500/10">
      <h2 className="text-xl font-semibold mb-4 text-gray-200">Verify Existing Proof</h2>

      <div className="mb-6">
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
            id="proof-file"
          />
          <label
            htmlFor="proof-file"
            className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-blue-500/30 rounded-lg cursor-pointer hover:border-blue-500/50 transition-colors duration-300"
          >
            <div className="text-center">
              <div className="text-blue-400 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-sm text-gray-300">
                Drop your proof file here or <span className="text-blue-400">browse</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      {verificationStatus === 'loading' && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-300">Verifying proof...</p>
        </div>
      )}

      {verificationStatus === 'error' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
          <p className="text-red-400">{errorMessage}</p>
        </div>
      )}

      {verificationStatus === 'success' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-4">
          <p className="text-emerald-400">Proof successfully verified!</p>
        </div>
      )}

      {proofDetails && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-200 mb-2">Proof Details</h3>
          <div className="bg-[#0c1f35] rounded-lg p-4 border border-blue-500/10">
            <pre className="text-xs text-gray-300 overflow-auto">
              {JSON.stringify(proofDetails, null, 2)}
            </pre>
          </div>
          <div className="text-sm text-gray-400">
            <span className="font-medium">Proof Hash:</span>
            <div className="font-mono mt-1 break-all text-cyan-400">{proofHash}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProofVerifier;