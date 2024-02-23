const HttpCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER: 500,
    // Agrega más códigos según sea necesario
}

class HttpError extends Error {
    constructor(status, message) {
        super(message)
        this.status = status
    }
}

module.exports = {
    HttpCode,
    HttpError,
}
