const express = require('express')
const router = express.Router()
const mesaController = require('../controllers/mesaController')
const validate = require('../middleware/validate')
const { updateMesaSchema, mesaSchema } = require('./validations/mesaValidation')
const auth = require('../middleware/auth')
const { ROLES } = require('../constants/roles/roles')

router.post(
    '/mesas',
    [auth([ROLES.ADMIN]), validate(mesaSchema)],
    mesaController.crearMesa
)
router.get('/mesas', auth([ROLES.ADMIN, ROLES.MOZO]), mesaController.getMesas)

router.get(
    '/mesas/ocupadas',
    auth([ROLES.ADMIN, ROLES.MOZO]),
    mesaController.getMesasOcupadas
)

router.get(
    '/mesas/libres',
    auth([ROLES.ADMIN, ROLES.MOZO]),
    mesaController.getMesasLibres
)

router.get(
    '/mesas/:id',
    auth([ROLES.ADMIN, ROLES.MOZO]),
    mesaController.getMesaById
)
router.put(
    '/mesas/:id',
    [auth([ROLES.ADMIN, ROLES.MOZO]), validate(updateMesaSchema)],
    mesaController.updateMesa
)
router.delete('/mesas/:id', auth([ROLES.ADMIN]), mesaController.deleteMesa)

module.exports = router
