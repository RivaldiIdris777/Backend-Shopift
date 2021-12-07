const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Create new order 
exports.newOrder = catchAsyncErrors( async( req, res, next) => {
    
})