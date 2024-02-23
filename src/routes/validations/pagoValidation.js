const Joi = require('joi')
const { METODOSPAGO } = require('../../constants/metodosPago/metodosPago')

const pagoSchema = Joi.object({
    fecha: Joi.date().required(),
    hora: Joi.string().required(),
    metodoPago: Joi.string()
        .valid(...Object.values(METODOSPAGO))
        .required(),
    total: Joi.number().greater(0).required(),
    empleadoId: Joi.number().required(),
    cajaId: Joi.number().required(),
    ordenId: Joi.number().required(),
})

const querySchema = Joi.object({
    fecha: Joi.string().optional(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    ordenId: Joi.number().optional(),
})

module.exports = {
    pagoSchema,
    querySchema,
}
