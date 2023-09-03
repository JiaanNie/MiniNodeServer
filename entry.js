const path = require('path');
const express = require('express');
const {logger} = require('./middlewares/logEvent')
const cors = require('cors')
const errorHanlder = require('./middlewares/errorHanlder')
const PORT = process.env.PORT || 3500
const subdirRouter = require('./routers/subdir')
const rootRouter = require('./routers/root')
const employeesRouter = require('./routers/api/employees')
const corsOptions = require('./config/corsOptions')
const registerRouter = require('./routers/api/register')
const authRouter = require('./routers/api/auth')
const refreshTokenRoute = require('./routers/api/refreshToken')
const logoutRoute = require('./routers/api/logout')
const {verifyJWT} = require('./middlewares/jwtVerifier')
const cookieParser = require('cookie-parser')
const credentials = require('./middlewares/credentials')
const app = express()
// let use some buildin middlewares

// the urlencoded is for when form data are being submitted in the url
// this allow the app to decode and get the data from the url
// because this function is being call right after the app being created
// all the get function will have this urlendcoded functionality, since this work like a waterfall

// all these are buildin middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser())
// the default value is the / you dont need but for reability i think is good to have it

// the modual.export=<name> has to match when you import it using the require statment
app.use(credentials)
//3party middlewares cors

app.use(cors(corsOptions))

app.use(errorHanlder)

app.use('/',express.static(path.join(__dirname, "public")))

app.use('/subdir',express.static(path.join(__dirname, "public")))

//applying new router which is a middlewire buildin

// non protected routes
app.use('/', rootRouter)
app.use('/register', registerRouter)
app.use('/subdir', subdirRouter )
app.use('/auth', authRouter)
app.use('/refresh', refreshTokenRoute)
app.use('/logout', logoutRoute)
// protected routes
app.use(verifyJWT)
app.use('/employees', employeesRouter)




// custom middlewares
app.use(logger)


// all the anonymous callback function within the get function they are call the route handlers,
// you can chain them together
// example 1
// app.get("/hello(.html)?", (req, res, next) => {
//     console.log('trying to load hello.html')
//     next()
// }, (req, res)=> {
//     // get redict to new page instead
//     res.redirect(301, '/index')
// })

// // example 2


// const routerHandler1 = (req, res, next) => {
//     console.log("1")
//     next()
// }

// const routerHandler2 = (req, res, next) => {
//     console.log("2")
//     next()
// }

// const routerHandler3 = (req, res) => {
//     console.log("finished")
// }

// app.get("/chain", [routerHandler1, routerHandler2, routerHandler3])



// if we didnt catch other url path that is the default response to the request
// this running like a waterfall it check the first get call then going down untill we reach to the end of this file.
// app.get('/*', (req, res) => {
//     // without the status function call we would return 200 instead of 404
//     res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
// })
app.all('*', (req, res)=> {
    res.status(404)
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if (req.accepts('json')) {
        res.json({erro: '404 not found'})
    }
    else {
        res.type('txt').send("404 not found")
    }
})
// adding custom error handler middleware
// the order of the param does matter ahhhh

app.listen(PORT, () => { console.log(`Server is running at ${PORT}`)})