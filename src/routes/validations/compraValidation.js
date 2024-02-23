const Joi = require('joi')

const compraSchema = Joi.object({
    fecha: Joi.date().required(),
    hora: Joi.string().required(),
    cantidadxCasillero: Joi.number().greater(0).optional(),
    cantidad: Joi.number().greater(0).required(),
    empleadoId: Joi.number().required(),
    itemInventarioId: Joi.number().required(),
})

const querySchema = Joi.object({
    fecha: Joi.string().optional(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
})

module.exports = {
    compraSchema,
    querySchema,
}
