const mongoose = require('mongoose');

const TransferModel = new mongoose.Schema({
    TransferBy: {
        type: String,
    },
    TransferTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    TransferAmount: {
        type: Number,
    },
    TransferDate: {
        type: Date,
    },
    transactionId: {
        type: String,
    },
    PaymentProof: {
        image: {
            type: String,
        },
        publicId: {
            type: String,
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Transfer', TransferModel);
