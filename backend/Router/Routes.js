const express = require('express')
const { register, login, logout, passwordChangeRequest, verifyOtpAndChangePassword, resendOtp, addDeliveryDetails, userDetails, GetDeliveryAddressOfUser, updateDeliveryAddress, getAllUsers, deleteUser, updateUser, toggleUserDeactive, getSingleUserById, VerifyUser, VerifyresendOtp } = require('../Controllers/Usercontroller')
const { protect } = require('../Middleware/Protect')
const upload = require('../Middleware/Multer')
const multer = require('multer')
const uploadVia = multer({
    storage: multer.memoryStorage(), // Use memory storage to store files in a buffer
});
const { createCategory, getAllCategory, getSingleCategory, updateCategory, deleteCategory } = require('../Controllers/CategoryController')
const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct } = require('../Controllers/ProductController')
const { createOrder, getAllOrder, updateOrderStatus, checkReferralCode, getMyOrderOnly, deliverMarkOrder } = require('../Controllers/OrderController')
const { getSingleVideo, updateVideo, deleteVideo, getAllVideo, createVideo } = require('../Controllers/VideoController')
const { TakeRequest, GetAll, DeleteRequest } = require('../Controllers/ContactController')
const { createPolicy, getAllPolicies, getSinglePolicy, updatePolicy, deletePolicy } = require('../Controllers/Policy.controller')
const { MakeWithdrawal, GetWithdrawals, DeleteWithdrawal, TransferAmount, getAllTransfers } = require('../Controllers/Withdrawal.controller')
const { getDashboardData } = require('../Controllers/Dashboard')
const router = express.Router()

// user routers 

router.post('/Create-User', register)
router.post('/Login', login)
router.get('/Logout', protect, logout)
router.post('/Password-Change', passwordChangeRequest)
router.post('/Verify-Otp', verifyOtpAndChangePassword)
router.post('/resend-otp', resendOtp)
router.post('/verify-otps', protect, VerifyUser)
router.post('/resend-otps', protect, VerifyresendOtp)






router.post('/Add-Delivery-Address', protect, addDeliveryDetails)
router.get('/user-details', protect, userDetails)
router.get('/get-Delivery-Address', protect, GetDeliveryAddressOfUser)
router.post('/update-Delivery-Address', protect, updateDeliveryAddress)
router.get('/AllUser', getAllUsers)
router.delete('/delete-user/:_id', deleteUser)
router.put('/update-user/:_id', upload.single('userImage'), updateUser)
router.put('/users/deactivate/:_id', toggleUserDeactive)
router.get('/get-single-user/:_id', getSingleUserById)

// category route here 

router.post('/create-category', createCategory)
router.get('/get-all-category', getAllCategory)
router.get('/get-single-category/:_id', getSingleCategory)
router.put('/update-category/:_id', updateCategory)
router.delete('/delete-category/:_id', deleteCategory)

// contacts route here 
router.post('/take-request', TakeRequest)
router.get('/get-all-request', GetAll)
router.delete('/delete-request/:id', DeleteRequest)

//MakeWithdrawal
router.post('/make-withdrawal', protect, MakeWithdrawal)
router.get('/get-withdrawal', GetWithdrawals)
router.delete('/DeleteWithdrawal/:withdrawalId/:userId', DeleteWithdrawal)
router.post('/Transfer-Amount/:withdrawalId', uploadVia.single('paymentProof'), TransferAmount)
router.get('/get-all-transfers', getAllTransfers)


//Dashboard
router.get('/dashboard', getDashboardData)





// policy route here 

const policyPrefix = '/policies';

router.post(`${policyPrefix}/create`, createPolicy);
router.get(`${policyPrefix}/all`, getAllPolicies);
router.get(`${policyPrefix}/:id`, getSinglePolicy);
router.put(`${policyPrefix}/update/:id`, updatePolicy);
router.delete(`${policyPrefix}/:id`, deletePolicy);



// product route 

router.post('/create-product', upload.single('images'), createProduct);         // Create product
router.get('/get-all-product', getAllProducts);                                 // Get all products
router.get('/get-single-product/:_id', getSingleProduct);                           // Get a single product by ID
router.put('/update-product/:_id', upload.single('images'), updateProduct);       // Update product by ID
router.delete('/delete-product/:_id', deleteProduct);

// order router 
router.post('/create-order', protect, createOrder);
router.get('/getMyOrderOnly', getMyOrderOnly);
router.post('/mark-order-delivered', deliverMarkOrder);


router.get('/get-all-order', getAllOrder);
router.post('/checkReferralCode', checkReferralCode);

router.put('/update-orders-status/:orderId', updateOrderStatus);

// video router 

router.post('/create-video', createVideo);
router.get('/get-all-video', getAllVideo);
router.get('/get-single-video/:_id', getSingleVideo);
router.put('/update-video/:_id', updateVideo);
router.delete('/delete-video/:_id', deleteVideo);



module.exports = router;