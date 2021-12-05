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

    const resPerPage = 4; 
    
    const apiFeatures = new APIFeatures(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage)

    const products = await apiFeatures.query;

    res.status(200).json({
        success:true,
        count: products.length,
        products
    })
})

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.id);

        if(!product) {
            return next(new ErrorHandler('Product not found', 404)); 
        }

        return res.status(404).jsons({
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