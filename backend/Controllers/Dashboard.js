const ContactModel = require('../Models/ContactModel');
const Order = require('../Models/OrderModel');
const User = require('../Models/UserModel');
const Product = require('../Models/ProductModel');
const Video = require('../Models/VideoModel')
const Withdrawal = require('../Models/WithDrawlRequest');
const TransferModel = require('../Models/TransferModel')



const getDashboardData = async (req, res) => {
    try {
        // Fetch the number of users
        const userCount = await User.countDocuments();

        const totalOrderAmount = await Order.aggregate([
    
            { $group: { _id: null, totalAmount: { $sum: '$finalMainPrice' } } }
        ]);
        // Fetch the number of orders with different statuses (Accepted, Pending, Delivered)
        const orderStatusCount = await Order.aggregate([
            {
                $match: {
                    OrderStatus: { $in: ['Accepted', 'Pending', 'Delivered'] }
                }
            },
            {
                $group: {
                    _id: "$OrderStatus",  // Group by OrderStatus field
                    count: { $sum: 1 }  // Count the number of orders per status
                }
            }
        ]);

        // Process the results to get count for each status (Accepted, Pending, Delivered)
        const orderCounts = {
            accepted: 0,
            pending: 0,
            delivered: 0
        };

        // Populate the orderCounts object with the actual counts
        orderStatusCount.forEach(status => {
            if (status._id === 'Accepted') {
                orderCounts.accepted = status.count;
            }
            if (status._id === 'Pending') {
                orderCounts.pending = status.count;
            }
            if (status._id === 'Delivered') {
                orderCounts.delivered = status.count;
            }
        });

        // Fetch the number of products
        const productCount = await Product.countDocuments();

        // Fetch the number of videos
        const videoCount = await Video.countDocuments();

        // Fetch the number of withdrawal requests (Pending or Completed)
        const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });
        const completedWithdrawals = await Withdrawal.countDocuments({ status: 'completed' });

        // Fetch the total amount transferred
        const totalTransferredAmount = await TransferModel.aggregate([
            { $group: { _id: null, totalAmount: { $sum: '$TransferAmount' } } }
        ]);

        // Return the aggregated data
        res.status(200).json({
            success: true,
            data: {
                totalOrderAmount:totalOrderAmount[0].totalAmount,
                userCount,
                productCount,
                videoCount,
                pendingWithdrawals,
                completedWithdrawals,
                totalTransferredAmount: totalTransferredAmount[0]?.totalAmount || 0,
                orderCounts,  // Add orderCounts object to the response
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({
            success: false,
            message: 'Server Error. Unable to fetch dashboard data.'
        });
    }
};

module.exports = { getDashboardData };

