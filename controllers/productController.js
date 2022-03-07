const productModel = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')

exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    try {        
        req.body.user = req.user.id;
        
        const product = await productModel.create(req.body);

        return res.status(201).json({
            success: true,            
            product
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed, Product data not save",
            success: false,
            detailProduct: null
        }, console.log(error))
    }
})

exports.getProducts =  catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 9; 
    const productCount = await productModel.countDocuments();

    const apiFeatures = new APIFeatures(productModel.find().clone(), req.query)
        .search()
        .filter()
    
    let products = await apiFeatures.query.clone();
    let filterProductsCount = products.length;

    apiFeatures.pagination(resPerPage)
    products = await apiFeatures.query;

    
    res.status(200).json({
        success:true,
        productCount,
        resPerPage,
        filterProductsCount,
        products
    })
    
})

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.id);

        if(!product) {
            return next(new ErrorHandler('Product not found', 404)); 
        }

        return res.status(200).json({
            message: "Success, Show data product",
            success: true,
            product
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed, something trouble",
            success: false,
            product: null
        }, console.log(error))
    }
})

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    try {
        let product = await productModel.findById(req.params.id);

        if(!product){
            return res.status(404).json({
                message: "Failed update data",
                success: false,
                product: null
            })
        }

        product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        next(error);
    }
})

exports.deleteProduct =  catchAsyncErrors(async (req, res, next) => {
        try {
            const product = await productModel.findById(req.params.id);

        if(!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        await product.remove();

        res.status(200).json({
            success: true,
            message: 'Product is deleted.'
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed, something trouble",
            success: false,
            product: null
        }, console.log(error))       
    }
})

exports.createProductReview = catchAsyncErrors( async (req, res, next) => {
    const { rating, comment, productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await productModel.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if(isReviewed) {
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })
})

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await productModel.findById(req.params.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await productModel.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await productModel.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindModify: false
    })

    res.status(200).json({
        success: true,        
    })
})