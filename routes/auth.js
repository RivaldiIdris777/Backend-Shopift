const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, getUserProfile, updatePassword, updateProfile, logout } = require('../controllers/authController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.post('/register', registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword)
router.route('/logout').post(logout);
router.route('/getProfile').get(isAuthenticatedUser, getUserProfile)
router.route('/password/update').put(isAuthenticatedUser, updatePassword)
router.route('/updateProfile/update').put(isAuthenticatedUser, updateProfile)

module.exports = router;