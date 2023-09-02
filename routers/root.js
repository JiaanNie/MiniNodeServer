const express = require('express')
const path = require('path')

const router = express.Router()



// regx explain
// ^/$ mean begin and end with a /
// | mean or
// index(.html)? the .html part is optional
router.get('^/$|/index(.html)?', (req, res) => {
    // res.sendFile("/views/index.html", {root: __dirname})
    res.sendFile(path.join(__dirname, "..", "views", "index.html"))
})
router.get('/new-page(.html)', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "new-page.html"))
})

router.get('/old-page(.html)?', (req, res) => {
    // we want to redirect to the new-page html
    // by default it return a 302 instead of 301
    // 301 mean permantly redirect
    // 302 mean temperoary redirect
    // if redirect incorrectly it might be a cache issues with the browers
    console.log("oldpage called")
    res.redirect(301, '/new-page.html')
})


module.exports = router
