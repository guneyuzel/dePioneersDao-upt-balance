import { Schema, model } from 'mongoose';

const balanceSchema = new Schema({
    publicKey: { type: String, required: true },
    tokenTicker: { type: String, required: true },
    balance: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Balance = model('Balance', balanceSchema);

export default Balance
