const Joi = require('joi')
const ROLES = require('../../constants/roles/roles')

const empleadoSchema = Joi.object({
    nick: Joi.string().min(4).required(),
    nombre: Joi.string().min(4).required(),
    apellido: Joi.string().min(4).required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')) //modificar por una mas compleja
        .required(),
    telefono: Joi.string()
        .pattern(/^\d{8,9}$/)
        .message('El teléfono debe tener 8 o 9 dígitos.'),
    rol: Joi.string()
        .valid(...Object.values(ROLES.ROLES)) //Con Object.values(ROLES.ROLES), obtenemos un array con los valores del objeto ROLES. Usamos el spread ... para expandir ese array dentro de
        .required(),
})

const updateEmpleadoSchema = Joi.object({
    nick: Joi.string().min(4).optional(),
    nombre: Joi.string().min(4).optional(),
    apellido: Joi.string().min(4).optional(),
    telefono: Joi.string()
        .pattern(/^\d{8,9}$/)
        .message('El teléfono debe tener 8 o 9 dígitos.')
        .optional(),
    rol: Joi.string()
        .valid(...Object.values(ROLES.ROLES)) //Con Object.values(ROLES.ROLES), obtenemos un array con los valores del objeto ROLES. Usamos el spread ... para expandir ese array dentro de
        .optional(),
    activo: Joi.bool().optional(),
})

const loginSchema = Joi.object({
    nick: Joi.string().min(4).required(),
    password: Joi.string().min(3).required(), //largo min de la contraseña definido en la regex de arriba
})

const resetPasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')) //modificar por una mas compleja
        .required(),
    newPassword: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')) //modificar por una mas compleja
        .required(),
})

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    nombre: Joi.string().max(255).optional(),
    apellido: Joi.string().max(255).optional(),
    rol: Joi.string().max(32).optional(),
    nick: Joi.string().max(255).optional(),
})

module.exports = {
    empleadoSchema,
    updateEmpleadoSchema,
    loginSchema,
    resetPasswordSchema,
    querySchema,
}
