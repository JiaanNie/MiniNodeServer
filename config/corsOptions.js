// you can just use the cors() when applying the middlewares, however this is the case
// only if you are open your server to the public use
// other cases you would likely need to restricted adding a whiteslist 
// only allow the people that in the whitelist that can access your server

// even if you put undefined in the whitelist it doesnt work 
const whitelist  = ['www.yourdomain.com', 'http://localhost:3500']
const corsOptions = {
    origin: (sender, callback) => {
        // for dev env you need the !origin because the sender from your localhost is undefine
        if(whitelist.indexOf(sender) !== -1 || !sender) {
            callback(null, true)
        }
        else {
            callback(new Error('sender is not in the whitelist'))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions

