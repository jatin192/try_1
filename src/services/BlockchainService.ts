import { ethers } from 'ethers';
import AnonAadhaarVerifier from '../contracts/artifacts/AnonAadhaarVerifier.json';

export interface ProofSubmissionResult {
    proofHash: string;
    transactionHash: string;
}

interface StoredProof {
    proofHash: string;
    timestamp: number;
    isValid: boolean;
}

// The contract is deployed on Sepolia testnet
const REQUIRED_CHAIN_ID = '11155111'; // Chain ID for Sepolia
const REQUIRED_NETWORK = {
    chainId: REQUIRED_CHAIN_ID,
    chainName: 'Sepolia',
    nativeCurrency: {
        name: 'Sepolia Ether',
        symbol: 'SEP',
        decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
};

export class BlockchainService {
    public provider: ethers.providers.Web3Provider | null = null;
    public contract: ethers.Contract | null = null;
    private contractAddress: string;

    constructor(contractAddress: string) {
        this.contractAddress = contractAddress;
    }

    private async checkAndSwitchNetwork(): Promise<void> {
        if (!window.ethereum) {
            throw new Error('MetaMask is not installed');
        }

        try {
            // Get current chain ID in hex format
            const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
            const requiredChainIdHex = '0x' + parseInt(REQUIRED_CHAIN_ID).toString(16);
            
            if (currentChainId === requiredChainIdHex) {
                return; // Already on correct network
            }

            // Try to switch to Sepolia
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: requiredChainIdHex }],
                });
            } catch (switchError: any) {
                // This error code indicates that the chain has not been added to MetaMask
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            ...REQUIRED_NETWORK,
                            chainId: requiredChainIdHex
                        }],
                    });
                } else if (switchError.code === 4001) {
                    throw new Error('User rejected network switch to Sepolia');
                } else {
                    throw new Error('Please switch to Sepolia network in MetaMask');
                }
            }
        } catch (error: any) {
            console.error('Network switch error:', error);
            throw error;
        }
    }

    private async verifyContractDeployment() {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }

        // Check if contract exists at address
        const code = await this.provider.getCode(this.contractAddress);
        if (code === '0x') {
            throw new Error(`No contract found at ${this.contractAddress}`);
        }

        // Create contract instance
        this.contract = new ethers.Contract(
            this.contractAddress,
            AnonAadhaarVerifier.abi,
            this.provider.getSigner()
        );

        // Verify contract interface
        try {
            // Check if contract has required functions
            const hasVerifyFunction = await this.contract.functions.hasOwnProperty('verifyProofExists');
            const hasSubmitFunction = await this.contract.functions.hasOwnProperty('submitProof');
            
            if (!hasVerifyFunction || !hasSubmitFunction) {
                throw new Error('Contract does not have required functions');
            }

            // Test contract read operation
            await this.contract.allProofs(ethers.constants.HashZero);
        } catch (error: any) {
            console.error('Contract verification error:', error);
            throw new Error('Invalid contract interface. Please verify contract address and deployment.');
        }
    }

    public async initializeProvider() {
        if (!window.ethereum) {
            throw new Error('MetaMask is not installed');
        }

        try {
            // Check and switch to correct network
            await this.checkAndSwitchNetwork();

            // Initialize provider after successful network switch
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            await this.provider.send("eth_requestAccounts", []); // Ensure we have permission
            
            const network = await this.provider.getNetwork();
            if (network.chainId !== parseInt(REQUIRED_CHAIN_ID)) {
                throw new Error('Please switch to Sepolia network in MetaMask');
            }

            // Verify contract deployment and interface
            await this.verifyContractDeployment();
        } catch (error: any) {
            console.error('Failed to initialize provider:', error);
            if (error.message.includes('No contract found')) {
                throw new Error('Smart contract not found on Sepolia network. Please verify contract deployment.');
            }
            throw error;
        }
    }

    async connectWallet(): Promise<string> {
        if (!window.ethereum) {
            throw new Error('MetaMask is not installed');
        }

        try {
            // First request accounts without network check
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found');
            }

            // After successful connection, check and switch network
            await this.checkAndSwitchNetwork();

            return accounts[0];
        } catch (error: any) {
            if (error.code === 4001) {
                throw new Error('User rejected the connection request');
            }
            throw error;
        }
    }

    async verifyProof(proofData: any): Promise<boolean> {
        if (!this.contract) {
            await this.initializeProvider();
            if (!this.contract) {
                throw new Error('Failed to initialize blockchain connection');
            }
        }

        try {
            if (!this.contract) {
                throw new Error('Failed to initialize blockchain connection');
            }

            // Get proof hash directly from the proof data
            const proofHash = proofData.proofHash || ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(proofData)));

            try {
                // Check if the proof exists using allProofs
                const exists = await this.contract.allProofs(proofHash);
                return exists;
            } catch (error: any) {
                console.error('Error verifying proof:', error);
                throw new Error('Failed to verify proof: ' + error.message);
            }
        } catch (error: any) {
            console.error('Error in verifyProof:', error);
            throw error;
        }
    }

    async submitProof(proof: any): Promise<ProofSubmissionResult> {
        // Check and switch to correct network first
        await this.checkAndSwitchNetwork();

        if (!this.provider || !this.contract) {
            await this.initializeProvider();
        }

        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        // Get proof hash directly from the proof
        const proofHash = proof.proofHash || ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(proof)));

        try {
            // Check if proof already exists
            const exists = await this.contract.allProofs(proofHash);
            if (exists) {
                console.log('Proof already exists:', proofHash);
                return {
                    proofHash,
                    transactionHash: '' // Empty transaction hash since no new transaction was made
                };
            }

            // Submit the proof hash
            const tx = await this.contract.submitProof(proofHash);
            console.log('Submitting proof with hash:', proofHash);
            
            // Wait for the transaction to be mined
            const receipt = await tx.wait();
            console.log('Proof submitted, receipt:', receipt);

            return {
                proofHash,
                transactionHash: receipt.transactionHash
            };
        } catch (error: any) {
            console.error('Submit error:', error);
            if (error.message.includes('user rejected')) {
                throw new Error('Transaction was rejected. Please approve the transaction to submit your proof.');
            }
            throw new Error('Failed to submit proof: ' + error.message);
        }
    }

    async getUserProofs(userAddress: string): Promise<StoredProof[]> {
        // Check and switch to correct network first
        await this.checkAndSwitchNetwork();

        if (!this.provider || !this.contract) {
            await this.initializeProvider();
        }

        if (!this.contract) {
            throw new Error('Contract not initialized');
        }

        return await this.contract.getUserProofs(userAddress);
    }
}
