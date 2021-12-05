const mongoose = require('mongoose')
const connectDatabase = () => {
    mongoose.connect("mongodb://localhost:27017/DB_Shop",{
        useNewUrlParser: true,
        useUnifiedTopology: true,        
    }).then(con => {
        console.log(`MongoDB Database connected with HOST ${con.connection.host}`)
    })
}

module.exports = connectDatabase