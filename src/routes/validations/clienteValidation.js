const Joi = require('joi')

const clienteSchema = Joi.object({
    nombre: Joi.string().min(3).required(),
    apellido: Joi.string().min(3).required(),
    telefono: Joi.string()
        .pattern(/^\d{8,9}$/)
        .message('El teléfono debe tener 8 o 9 dígitos.'),
})
const querySchema = Joi.object({
    //page y limit pueden ser enteros y -1
    page: Joi.number().min(-1).optional(),
    limit: Joi.number().min(-1).optional(),
    nombre: Joi.string().max(255).optional(),
    apellido: Joi.string().max(255).optional(),
})
const updateClienteSchema = Joi.object({
    nombre: Joi.string().min(3).optional(),
    apellido: Joi.string().min(3).optional(),
    telefono: Joi.string()
        .pattern(/^\d{8,9}$/)
        .message('El teléfono debe tener 8 o 9 dígitos.')
        .optional(),
    cuenta: Joi.number().min(0).optional(),
})

module.exports = {
    clienteSchema,
    updateClienteSchema,
    querySchema,
}
