const express = require('express');
const cors = require('cors');
const app = express();

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv');

const errorMiddleware = require('./middlewares/errors');

// Setting up config file
dotenv.config({ path: "config/config.env" })

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(fileUpload({useTempFiles: true}))
app.use(cors());


const productRoute = require('./routes/product');
const authRoute = require('./routes/auth');
const orderRoute = require('./routes/order');
const paymentRoute = require('./routes/payment');

app.use('/api/v1', productRoute);
app.use('/api/v1', authRoute);
app.use('/api/v1', orderRoute);
app.use('/api/v1', paymentRoute);

app.use(errorMiddleware);

module.exports = app
