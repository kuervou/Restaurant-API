const Joi = require('joi')

const mesaSchema = Joi.object({
    nroMesa: Joi.number().required(),
    libre: Joi.bool().optional(),
})

const updateMesaSchema = Joi.object({
    nroMesa: Joi.number().optional(),
    libre: Joi.bool().optional(),
})

module.exports = {
    mesaSchema,
    updateMesaSchema,
}
