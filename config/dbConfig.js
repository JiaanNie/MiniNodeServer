const mongoose = require('mongoose')

const DBURI =  `${process.env.PREFIX}${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}${process.env.SERVER}`

const connectDB =  async () => {
    try {
        await mongoose.connect(DBURI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })

    }catch(error) {
        console.log(error)

    }
}


module.exports = connectDB