const express = require('express')
const router = express.Router()
const empleadoController = require('../controllers/empleadoController')
const validate = require('../middleware/validate')
const {
    empleadoSchema,
    updateEmpleadoSchema,
    loginSchema,
    resetPasswordSchema,
    querySchema,
} = require('./validations/empleadoValidation')
const auth = require('../middleware/auth')
const { ROLES } = require('../constants/roles/roles')

//agregarle el auth luego
router.post(
    '/empleados',
    auth([ROLES.ADMIN]),
    validate(empleadoSchema),
    empleadoController.crearEmpleado
)
router.post(
    '/login',
    validate(loginSchema),
    validate(querySchema, 'query'),
    empleadoController.login
)
router.get('/empleados', auth([ROLES.ADMIN]), empleadoController.getEmpleados)
router.get(
    '/empleados/:id',
    auth([ROLES.ADMIN]),
    empleadoController.getEmpleadoById
)
router.put(
    '/empleados/:id',
    [auth([ROLES.ADMIN]), validate(updateEmpleadoSchema)],
    empleadoController.updateEmpleado
)
router.delete(
    '/empleados/:id',
    auth([ROLES.ADMIN]),
    empleadoController.deleteEmpleado
)
router.patch(
    '/resetPassword/:id',
    auth([]),
    validate(resetPasswordSchema),
    empleadoController.resetPassword
)

module.exports = router
