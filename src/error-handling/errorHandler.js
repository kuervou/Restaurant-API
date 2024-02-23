const { HttpError, HttpCode } = require('./http_error')

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    if (err instanceof HttpError) {
        res.status(err.status).json({
            message: err.message,
            status: err.status,
        })
    } else {
        const errorMessage = {
            message: 'Error interno del servidor',
            status: HttpCode.INTERNAL_SERVER,
        }

        if (
            process.env.NODE_ENV === 'DEVELOPMENT' ||
            process.env.NODE_ENV === 'LOCAL' ||
            process.env.NODE_ENV === 'TEST'
        ) {
            errorMessage['stack'] = err.stack
        }

        res.status(HttpCode.INTERNAL_SERVER).json(errorMessage)
    }
}

module.exports = errorHandler
