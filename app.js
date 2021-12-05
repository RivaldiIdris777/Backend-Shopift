const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

const errorMiddleware = require('./middlewares/errors');

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors());

const productRoute = require('./routes/product');
const authRoute = require('./routes/auth');

app.use('/api/v1', productRoute);
app.use('/api/v1', authRoute);

app.use(errorMiddleware);

module.exports = app
