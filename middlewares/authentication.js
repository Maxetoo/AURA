const { StatusCodes } = require('http-status-codes')
const { signJwt } = require('../services/helpers')
const CustomError = require('../errors')

const authentication = (req, res, next) => {
    const authToken = req.signedCookies.token
    if (!authToken) {
        throw new CustomError.UnauthorizedError('You are not logged in')
    }
    const user = signJwt(authToken)
    req.user = user
    next()
}


const authorization = (req, res, next) => {
    const { isAdmin } = req.user
    if (!isAdmin) {
        throw new CustomError.UnauthorizedError('Not authorized')
    }
    next()
}


module.exports = {
    authentication,
    authorization,
}