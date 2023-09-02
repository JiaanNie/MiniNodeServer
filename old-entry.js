const logEvents = require('./logs/logEvent')

const http = require('http')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

// nomrally you can read the port from the enviorment variable, for now we just hardcode it as 3500
const PORT  = process.env.PORT || 3500

const EventEmitter = require('events')
class Emitter extends EventEmitter {}
const myEmitter = new Emitter()
myEmitter.on("logEvent", (message, logFileName) => {
    logEvents(message, logFileName)
})


const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath, 
            contentType.includes('image')? '':'utf-8'  
        );
        data = contentType === 'application/json'? JSON.parse(rawData) : rawData
        response.writeHead(
            filePath.includes('404.html')? 404: 200, 
            {'ContentType': contentType}
        )
        response.end(
            contentType === "application/json" ? JSON.stringify(data) : data
        )
    } catch (error) {
        myEmitter.emit('logEvent', `${error.name}: ${error.message}`, 'errorLogs.txt')
        console.log(error )
        response.statusCode = 500
        response.end()
    }
}

const server = http.createServer((request, response) => {
    const extension = path.extname(request.url)
    myEmitter.emit('logEvent', `${request.url}\t${request.method}`, 'requestLogs.txt')
    let contentType;
    switch(extension) {
        case '.css':
            contentType = "text/css"
            break;
        case '.js':
            contentType = "text/javascript"
            break;
        case '.json':
            contentType = "application/json"
            break;
        case '.jpg':
            contentType = "image/jpeg"
            break;
        case '.png':
            contentType = "image/png"
            break;
        case '.txt':
            contentType = "text/plain"
            break;
        default:
            contentType = "text/html"
    }
    let filePath =
        contentType === "text/html" && request.url === "/"
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === "text/html" && request.url.slice(-1) === "/"
                ? path.join(__dirname, 'views', request.url, 'index.html')
                : contentType === "text/html"
                    ? path.join(__dirname, 'views', request.url)
                    : path.join(__dirname, request.url)
    if(!extension && request.url.slice(-1) !== '/') {
        filePath += '.html'
    }

    const fileExist = fs.existsSync(filePath)

    if(fileExist) {
        // server file
        serveFile(filePath, contentType, response)
    }
    else {
        // 404 
        // 301
        switch(path.parse(filePath).base) {
            case "old-page.html":
                response.writeHead(301, {'Location': '/'});
                response.end()
                break;
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), contentType, response)


        }
    }

    console.log(request.url, request.method, extension, filePath, response.statusCode)

})

server.listen(PORT, () => console.log(`server is running at port ${PORT}`))