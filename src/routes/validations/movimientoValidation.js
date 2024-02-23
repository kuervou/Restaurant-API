const Joi = require('joi')
const { MOVIMIENTOS } = require('../../constants/movimientos/movimientos')

const movimientoSchema = Joi.object({
    fecha: Joi.date().required(),
    hora: Joi.string().required(),
    tipo: Joi.string()
        .valid(...Object.values(MOVIMIENTOS))
        .required(),
    observacion: Joi.string().optional(),
    total: Joi.number().greater(0).required(),
    empleadoId: Joi.number().required(),
    cajaId: Joi.number().required(),
})

const querySchema = Joi.object({
    fecha: Joi.string().optional(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
})

const getByCajaIdSchema = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
})

module.exports = {
    movimientoSchema,
    querySchema,
    getByCajaIdSchema,
}
