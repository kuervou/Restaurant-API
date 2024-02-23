const { HttpCode, HttpError } = require('../error-handling/http_error')

module.exports = function (schema, property = 'body') {
    return (req, res, next) => {
        const { error } = schema.validate(req[property])
        if (error) {
            throw new HttpError(HttpCode.BAD_REQUEST, error.details[0].message)
        }
        next()
    }
}
