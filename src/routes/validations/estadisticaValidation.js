const Joi = require('joi')

const statsSchema = Joi.object({
    dia: Joi.date().iso().optional(),
    mes: Joi.number().optional(),
    anio: Joi.number().optional(),
})

const diaSchema = Joi.object({
    dia: Joi.date().iso().required(),
})

const mesSchema = Joi.object({
    mes: Joi.number().required(),
})

const anioSchema = Joi.object({
    anio: Joi.number().required(),
})

module.exports = {
    statsSchema,
    diaSchema,
    mesSchema,
    anioSchema,
}
