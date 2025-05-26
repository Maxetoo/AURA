const BadRequestError = require('./BadRequest')
const NotFoundError = require('./NotFound')
const UnauthorizedError = require('./UnAuthorised')

const CustomError = {
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
}

module.exports = CustomError