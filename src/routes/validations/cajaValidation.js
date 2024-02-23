const Joi = require('joi')

const cajaSchema = Joi.object({
    total: Joi.number().optional(),
})

module.exports = {
    cajaSchema,
}
