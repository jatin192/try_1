# Anon Aadhaar Vite Setup

Anonymous Aadhaar is a zero-knowledge proof solution that allows users to prove their Aadhaar identity while maintaining complete privacy and anonymity. This implementation uses React.js with Vite for a fast and efficient development experience.

## Features

- **Zero-Knowledge Proofs:** Verify Aadhaar identity without revealing personal information
- **Privacy-First:** No storage of personal data or Aadhaar details
- **User-Friendly Interface:** Simple and intuitive process for identity verification
- **Fast Development:** Built with Vite for quick development and hot module replacement
- **Type Safety:** Implemented with TypeScript for better code quality
- **Modern Stack:** Uses React.js and latest web technologies

## Technologies Used
- **Frontend:** React.js with TypeScript
- **Build Tool:** Vite
- **Zero-Knowledge Proofs:** Anon Aadhaar SDK
- **Styling:** CSS/SCSS
- **Development:** Node.js

## Use Cases
- Anonymous identity verification
- Privacy-preserving authentication
- Decentralized applications requiring Aadhaar verification
- Services needing age verification without data exposure
- Secure voting systems

## Installation Steps
1. Clone the repository:
    ```bash
    git clone [your-repo-url]
    ```

2. Install Dependencies:
    ```bash
    cd anon-aadhaar-vite-setup
    yarn install
    ```

3. Configure Environment:
    Create a `.env` file in the root directory and add your app ID:
    ```
    NEXT_PUBLIC_APP_ID=your_app_id_here
    ```

4. Start the Development Server:
    ```bash
    yarn dev
    ```

Open your browser and navigate to http://localhost:3000

## How to Use

1. **Connect:** Start the application and connect your wallet
2. **Upload:** Provide your Aadhaar PDF for verification
3. **Verify:** Complete the zero-knowledge proof generation
4. **Done:** Receive your anonymous verification proof

## Development

To contribute to this project:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

This project prioritizes user privacy and security:
- No personal data is stored
- All proofs are generated client-side
- Zero-knowledge proofs ensure complete anonymity
- No Aadhaar details are transmitted or stored

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- Anon Aadhaar Team
- Privacy & Identity Contributors
- Zero Knowledge Proof Community
