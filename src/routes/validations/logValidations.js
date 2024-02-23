const Joi = require('joi')

const abrirBotellaSchema = Joi.object({
    itemInventarioId: Joi.number().min(1).required(),
    empleadoId: Joi.number().min(1).required(),
})
const cerrarBotellaSchema = Joi.object({
    itemInventarioId: Joi.number().min(1).required(),
    empleadoId: Joi.number().min(1).required(),
})

const logQuerySchema = Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
})

module.exports = {
    abrirBotellaSchema,
    cerrarBotellaSchema,
    logQuerySchema,
}
