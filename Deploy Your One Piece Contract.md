# 🚀 Deploy Your One Piece Smart Contract

Welcome to the **ultimate guide** on deploying your One Piece contract! By the end of this lesson, you'll have your contract live on **Arbitrum Sepolia Testnet** and ready to roll. Let's get started! 🏴‍☠️💰



## 🛠 Step 1: Set Up Remix and Load Your Contract
1. Open [Remix](https://remix.ethereum.org/) in your browser.
2. Create a new Solidity file (e.g., `OnePieceMint.sol`).
3. Copy and paste your contract code into the file.

🔹 **Pro Tip:** Make sure your code is well-formatted and error-free before proceeding!



## ⚙️ Step 2: Compile Your Smart Contract
1. Click on the **Solidity Compiler** tab in Remix.
2. Select the correct **compiler version** (as required by your contract).
3. Hit **Compile OnePieceMint.sol** and watch for a green checkmark ✅.

💡 **Why Compile?** This step ensures your contract has no syntax errors before deployment.



## 🚀 Step 3: Deploying the Contract on Arbitrum Sepolia
### **Get Ready for Deployment!**
Before deployment, make sure you have the following constructor parameters from previous lessons:
```solidity
constructor(
    address vrfCoordinatorV2Address,
    uint256 subscriptionId,
    bytes32 keyHash,
    uint32 callbackGasLimit
)
```

### **Deploy in Just a Few Clicks!**
1. Go to the **Deploy & Run Transactions** tab in Remix.
2. Select **Injected Provider - MetaMask** from the environment dropdown.
3. Make sure your MetaMask is set to **Arbitrum Sepolia Testnet**.
4. Enter the constructor parameters with values obtained from the previous lessons.
5. Click **Deploy** and confirm the transaction in MetaMask.

🔥 **Boom! Your contract is now deployed!** 🎉



## 🔍 Step 4: Verify Your Contract on Arbitrum Sepolia Scan
1. Open [Arbitrum Sepolia Scan](https://sepolia.arbiscan.io/).
2. Find your deployed contract and click on **Verify and Publish**.
3. Select the **compiler type, version, and license type** (refer to the images below if needed).
4. **Flatten your contract:**
   - Right-click your Solidity file in Remix.
   - Click **Flatten**.
5. Copy the entire flattened contract and paste it into Arbitrum Sepolia Scan’s verification page.
6. Click **Verify and Publish**.

✅ **Once verified, you can now see your ABI, bytecode, and contract source code on Arbitrum Sepolia Scan!** 🚀



## 🔗 Step 5: Add Consumers to Chainlink VRF
Time to give your contract **Chainlink VRF superpowers!** 💎✨

1. Copy your deployed **contract address**.
2. Head over to [Chainlink VRF Arbitrum Sepolia](https://vrf.chain.link/arbitrum-sepolia).
3. Click on your **Subscription ID**.
4. Hit **Add Consumer**.
5. Paste your contract address and click **Add Consumer**.
6. Confirm the transaction in MetaMask.

🎥 **Watch the magic happen in this GIF:**

![](https://github.com/0xmetaschool/Learning-Projects/blob/main/assests_for_all/one-piece-dapp/Deploy%20Smart%20Contracts/Frame_3560365_(29).webp)



## 🎯 Wrap-up & Next Steps
Congratulations! 🎉 You successfully:
✅ Deployed your contract using Remix.
✅ Verified it on Arbitrum Sepolia Scan.
✅ Added it as a **consumer** to Chainlink VRF.

Up next? We’ll build an **interactive frontend** to interact with your contract! Stay tuned. 🔥
