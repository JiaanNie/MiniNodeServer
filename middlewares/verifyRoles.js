

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.roles) return res.sendStatus(401)
        console.log(req)
        const roles = [...allowedRoles]
        console.log(roles, req.roles)
        const result = req.roles.map((role)=> roles.includes(role)).find((val) => val === true )
        if (!result) return res.sendStatus(401)
        next()
    }
}

module.exports = verifyRoles