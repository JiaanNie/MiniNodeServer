const { format } = require('date-fns');
const {v4: uuid} = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')


const logEvents = async (message, logFileName) => {
    const dataTime = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`
    const logItem = `${dataTime}\t${uuid()}\t${message}\n`
    console.log(logItem)
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'Logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'Logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..','Logs', logFileName), logItem)

    }
    catch(error) {
        console.log(error)
    }

}

const logger = (req, res, next)=> {
    const message = `${req.path} ${req.method} ${req.headers.origin}`
    logEvents(message, 'requestLogs.txt')
    next()
}

module.exports = {logger, logEvents}