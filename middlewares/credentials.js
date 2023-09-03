const allowOrigins = require('../config/allowOrigins')

const credentials = (req, res, next) => {
    const origin = req.headers.origin
    if(allowOrigins.includes(origin)) {
        res.headers('Access-Control-Allow-Origin', true) 
    }
    next();
}

module.exports = credentials