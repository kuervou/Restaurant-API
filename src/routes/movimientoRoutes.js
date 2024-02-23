const express = require('express')
const router = express.Router()
const movimientoController = require('../controllers/movimientoController')
const auth = require('../middleware/auth')
const { ROLES } = require('../constants/roles/roles')
const {
    movimientoSchema,
    querySchema,
    getByCajaIdSchema,
} = require('./validations/movimientoValidation')
const validate = require('../middleware/validate')

router.post(
    '/movimientos',
    auth([ROLES.ADMIN]),
    validate(movimientoSchema),
    movimientoController.crearMovimiento
)
router.get(
    '/movimientos',
    auth([ROLES.ADMIN]),
    validate(querySchema),
    movimientoController.getMovimientos
)
router.get(
    '/movimientos/:id',
    auth([ROLES.ADMIN]),
    movimientoController.getMovimientoById
)

router.get(
    '/movimientos/caja/:id',
    auth([ROLES.ADMIN]),
    validate(getByCajaIdSchema),
    movimientoController.getMovimientosByCajaId
)

router.delete(
    '/movimientos/:id',
    auth([ROLES.ADMIN]),
    movimientoController.deleteMovimiento
)

module.exports = router
