import { Connection, PublicKey, PublicKeyInitData } from '@solana/web3.js';
import { programs } from '@metaplex/js';
import mongoose from 'mongoose';
import Balance from './balanceModel'; // Import the Balance model
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || '';

mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

async function getTokenBalance(publicKeyString: PublicKeyInitData, tokenAccountAddressString: PublicKeyInitData, tokenMintAddressString: PublicKeyInitData) {
    try {
        const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
        const publicKey = new PublicKey(publicKeyString);
        const tokenAccountAddress = new PublicKey(tokenAccountAddressString);
        const tokenMintAddress = new PublicKey(tokenMintAddressString);

        // Fetch the token account information
        const tokenAccountInfo = await connection.getTokenAccountBalance(tokenAccountAddress);

        // Fetch the token metadata
        const metadata = await programs.metadata.Metadata.findByMint(connection, tokenMintAddress);

        // Extract the symbol from the metadata, ensuring correct property access
        const tickerSymbol = metadata.data.data.symbol.toString() || tokenMintAddressString.toString(); // Use metadata symbol, or map, or address

        const currentBalance = tokenAccountInfo.value.uiAmount;

        console.log(`Balance of ${publicKey.toString()} for token ${tickerSymbol} is:`, currentBalance);

        // Check for balance changes and save to database
        const lastBalanceEntry = await Balance.findOne({ publicKey: publicKeyString, tokenTicker: tickerSymbol }).sort({ timestamp: -1 });

        if (!lastBalanceEntry || lastBalanceEntry.balance !== currentBalance) {
            const newBalanceEntry = new Balance({
                publicKey: publicKeyString,
                tokenTicker: tickerSymbol,
                balance: currentBalance,
            });

            await newBalanceEntry.save();
            console.log('Balance updated and saved to database');
        } else {
            console.log('Balance has not changed, no update needed');
        }

        return currentBalance;

    } catch (error) {
        console.error('Error fetching token balance:', error);
        return null;
    }
}


// Function to call getTokenBalance with predefined parameters
async function checkAndUpdateBalance() {
    const publicKeyString = 'DaoiRyzeqXfmPs1sdgw2NabAwHJF6vcFCdUBz98vcxxX'; // Replace with the public key of the account you want to check
    const tokenAccountAddressString = '66HAoYNmHjCoswdbPnqju4abTfY3KxkBEJZH2KZGEuAR'; // Replace with the token's account address
    const tokenMintAdressString = "UPTx1d24aBWuRgwxVnFmX4gNraj3QGFzL3QqBgxtWQG"; // Replace with the token's mint address

    await getTokenBalance(publicKeyString, tokenAccountAddressString, tokenMintAdressString);
}

// Schedule checkAndUpdateBalance to run every 1 minute
setInterval(checkAndUpdateBalance, 60000);
