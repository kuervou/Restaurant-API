const Joi = require('joi')

const grupoSchema = Joi.object({
    nombre: Joi.string().min(4).required(),
    esBebida: Joi.bool().required(),
})
const querySchema = Joi.object({
    page: Joi.number().min(-1).optional(),
    limit: Joi.number().min(-1).optional(),
    nombre: Joi.string().max(255).optional(),
    esBebida: Joi.bool().optional(),
})

const updateGrupoSchema = Joi.object({
    nombre: Joi.string().min(4).optional(),
    esBebida: Joi.bool().optional(),
})

module.exports = {
    grupoSchema,
    querySchema,
    updateGrupoSchema,
}
