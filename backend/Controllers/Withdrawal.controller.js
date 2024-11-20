const User = require('../Models/UserModel');
const Withdrawal = require('../Models/WithDrawlRequest');
const cloudinary = require('cloudinary').v2;
require('dotenv').config()

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    cloud_name: process.env.CLOUD_NAME
});
const TransferModel = require('../Models/TransferModel')
exports.MakeWithdrawal = async (req, res) => {
    const userId = req.user && req.user.id ? req.user.id._id : null; // Safely get userId
    if (!userId) {
        return res.status(400).json({ message: "Please re-login to perform this action" });
    }

    const { amount, receivedMethod, transactionId, bankDetails, upiDetails } = req.body;

    try {
        // Validate the amount against the referral code bonus
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        if (amount > user.referralCodeBonus) {
            return res.status(400).json({ message: `Amount cannot be greater than available balance ${user.referralCodeBonus}` });
        }

        // Validate required fields
        if (!amount || !receivedMethod) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Prepare the withdrawal data
        const withdrawalData = {
            userId,
            amount,
            status: 'pending',
            transactionId: transactionId || '',
            receivedMethod,
        };

        if (receivedMethod === 'Bank') {
            if (!bankDetails || !bankDetails.name || !bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName) {
                return res.status(400).json({ message: 'Incomplete bank details' });
            }
            withdrawalData.paymentDetails = {
                bank: {
                    name: bankDetails.name,
                    accountNumber: bankDetails.accountNumber,
                    ifscCode: bankDetails.ifscCode,
                    accountHolderName: bankDetails.accountHolderName,
                },
            };
        }
        // Add UPI details if received method is 'Upi'
        else if (receivedMethod === 'Upi') {
            if (!upiDetails || !upiDetails.id || !upiDetails.name) {
                return res.status(400).json({ message: 'Incomplete UPI details' });
            }
            withdrawalData.paymentDetails = {
                upi: {
                    id: upiDetails.id,
                    name: upiDetails.name,
                },
            };
        }

        // Round the amount and user's referralCodeBonus to 2 decimal places
        const roundedAmount = Math.round(amount * 100) / 100;
        user.referralCodeBonus = Math.round((user.referralCodeBonus - roundedAmount) * 100) / 100;

        const newWithdrawal = new Withdrawal(withdrawalData);

        await newWithdrawal.save();
        user.WithdrawalRequestIds.push(newWithdrawal._id);
        await user.save();

        res.status(201).json({
            message: 'Withdrawal request created successfully',
            data: newWithdrawal,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

exports.GetWithdrawals = async (req, res) => {
    try {
        const { id } = req.query;

        const filter = {}; // Initialize filter object

        // If id is provided, filter by withdrawal id or user id
        if (id) {
            // Check if the id is a withdrawal ID or user ID
            if (id.length === 24) { // Assuming it's a valid ObjectId length
                filter.userId = id; // Filter by withdrawal ID
            } else {
                filter.userId = id; // Filter by user ID
            }
        }

        // Fetch withdrawals, sorted by createdAt in descending order
        const withdrawals = await Withdrawal.find(filter).sort({ createdAt: -1 });

        if (withdrawals.length === 0) {
            return res.status(404).json({ message: 'No withdrawals found' });
        }

        res.status(200).json({
            message: 'Withdrawals fetched successfully',
            data: withdrawals,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};


exports.DeleteWithdrawal = async (req, res) => {
    const { withdrawalId, userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "Please re-login to perform this action" });
    }

    try {
        const withdrawal = await Withdrawal.findOne({ _id: withdrawalId, userId: userId });

        if (!withdrawal) {
            return res.status(404).json({ message: 'Withdrawal request not found' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the deleted withdrawal from the user's withdrawal request list
        user.WithdrawalRequestIds = user.WithdrawalRequestIds.filter(
            (id) => id.toString() !== withdrawalId.toString()
        );

        user.referralCodeBonus += withdrawal.amount;
        await user.save();
        await withdrawal.deleteOne();
        res.status(200).json({
            message: 'Withdrawal request deleted successfully and amount re-added to user balance',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

exports.TransferAmount = async (req, res) => {
    const { withdrawalId } = req.params;
    const { userId, TransferBy, transactionId } = req.body;
    const paymentProof = req.file ? req.file.paymentProof : null;
    // console.log(req.file)
    if (!userId) {
        return res.status(400).json({ message: "Please re-login to perform this action" });
    }

    try {
        const withdrawal = await Withdrawal.findOne({ _id: withdrawalId });
        if (!withdrawal) {
            return res.status(404).json({ message: 'Withdrawal request not found' });
        }

        if (withdrawal.status === "completed") {
            return res.status(400).json({ message: 'Withdrawal request is already processed' });
        }
        let uploadedImage;
        if (req.file) {
            // Using Cloudinary's stream upload for buffer
            const streamUpload = (buffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "payment_proofs" },
                        (error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        }
                    );
                    stream.end(buffer);
                });
            };

            uploadedImage = await streamUpload(req.file.buffer);
            console.log(uploadedImage);
        }

        const transfer = new TransferModel({
            TransferBy: 'admin' || TransferBy,
            TransferTo: withdrawal.userId,
            TransferAmount: withdrawal.amount,
            TransferDate: new Date(),
            transactionId: transactionId,
            PaymentProof: uploadedImage
                ? {
                    image: uploadedImage.secure_url,
                    publicId: uploadedImage.public_id,
                }
                : {},
        });

        await transfer.save();
        withdrawal.transactionId = transfer.transactionId
        withdrawal.status = 'completed';
        await withdrawal.save();

        res.status(200).json({
            message: 'Withdrawal processed and amount transferred successfully',
            data: transfer,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};


exports.getAllTransfers = async (req, res) => {
    try {
        const transfers = await TransferModel.find()
            .sort({ createdAt: -1 }) 
            .populate('TransferTo', ) 
            .exec();

        res.status(200).json({
            message: 'Transfers retrieved successfully',
            data: transfers,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};