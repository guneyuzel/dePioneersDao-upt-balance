const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Balance = require('./balanceModel'); // Ensure this path is correct
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Replace <username>, <password>, and <dbname> with your MongoDB Atlas credentials
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

app.post('/api/balances', async (req, res) => {
    try {
        const { publicKey, tokenTicker, balance } = req.body;
        const newBalanceEntry = new Balance({ publicKey, tokenTicker, balance });
        await newBalanceEntry.save();
        res.status(201).json(newBalanceEntry);
    } catch (error) {
        console.error('Error saving balance data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
