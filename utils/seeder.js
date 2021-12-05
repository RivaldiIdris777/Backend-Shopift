const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/Products.json');

dotenv.config({ path: '../config/config.env' });

connectDatabase();

const seedProducts = async () => {
    try {        

        await Product.insertMany(products)
        console.log('All Products are added.');

        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedProducts()