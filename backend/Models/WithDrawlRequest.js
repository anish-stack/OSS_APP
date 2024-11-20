const mongoose = require('mongoose');

const WithDrawlSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
    },
    transactionId: {
        type: String,
        trim: true,
    },
    receivedMethod: {
        type: String,
        enum: ['Bank', 'Upi'],
        required: true,
    },
    paymentDetails: {
        bank: {
            name: { type: String, trim: true },
            accountNumber: { type: String, trim: true },
            ifscCode: { type: String, trim: true },
            accountHolderName: { type: String, trim: true },
        },
        upi: {
            id: { type: String, trim: true },
            name: { type: String, trim: true },
        },
    },
    PaymentReleasedDate: {
        type: Date,
    }
}, { timestamps: true });

module.exports = mongoose.model('Withdrawal', WithDrawlSchema);
