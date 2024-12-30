// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AnonAadhaarVerifier
 * @dev Contract for verifying anonymous Aadhaar proofs
 */
contract AnonAadhaarVerifier {
    // Events
    event ProofSubmitted(
        address indexed user,
        bytes32 indexed proofHash,
        uint256 timestamp
    );

    event ProofVerified(
        bytes32 indexed proofHash,
        bool isValid,
        uint256 timestamp
    );

    // Structs
    struct ProofData {
        bytes32 proofHash;
        uint256 timestamp;
        bool isValid;
    }

    // State variables
    mapping(bytes32 => bool) public allProofs;                    // All valid proofs
    mapping(address => bytes32[]) private userProofHashes;        // User's proof hashes for tracking
    mapping(bytes32 => ProofData) public proofDetails;           // Detailed proof data

    /**
     * @dev Submit a new proof hash
     * @param proofHash The keccak256 hash of the proof
     */
    function submitProof(bytes32 proofHash) public {
        require(!allProofs[proofHash], "Proof already submitted");
        
        // Store the proof
        allProofs[proofHash] = true;
        userProofHashes[msg.sender].push(proofHash);
        
        // Store proof details
        proofDetails[proofHash] = ProofData({
            proofHash: proofHash,
            timestamp: block.timestamp,
            isValid: true
        });

        emit ProofSubmitted(msg.sender, proofHash, block.timestamp);
    }

    /**
     * @dev Verify if a proof exists and is valid
     * @param proofHash The keccak256 hash of the proof to verify
     * @return bool True if the proof exists and is valid
     */
    function verifyProofExists(bytes32 proofHash) public view returns (bool) {
        return allProofs[proofHash] && proofDetails[proofHash].isValid;
    }

    /**
     * @dev Get all proofs submitted by a specific user
     * @param user The address of the user
     * @return ProofData[] Array of proof data structures
     */
    function getUserProofs(address user) public view returns (ProofData[] memory) {
        bytes32[] memory hashes = userProofHashes[user];
        ProofData[] memory proofs = new ProofData[](hashes.length);
        
        for (uint i = 0; i < hashes.length; i++) {
            proofs[i] = proofDetails[hashes[i]];
        }
        
        return proofs;
    }

    /**
     * @dev Get details of a specific proof
     * @param proofHash The hash of the proof to query
     * @return ProofData The proof data structure
     */
    function getProofDetails(bytes32 proofHash) public view returns (ProofData memory) {
        require(allProofs[proofHash], "Proof does not exist");
        return proofDetails[proofHash];
    }

    /**
     * @dev Invalidate a proof (only the original submitter can do this)
     * @param proofHash The hash of the proof to invalidate
     */
    function invalidateProof(bytes32 proofHash) public {
        bool isSubmitter = false;
        bytes32[] memory userProofs = userProofHashes[msg.sender];
        
        for (uint i = 0; i < userProofs.length; i++) {
            if (userProofs[i] == proofHash) {
                isSubmitter = true;
                break;
            }
        }
        
        require(isSubmitter, "Only the proof submitter can invalidate");
        require(allProofs[proofHash], "Proof does not exist");
        
        proofDetails[proofHash].isValid = false;
        
        emit ProofVerified(proofHash, false, block.timestamp);
    }
}
