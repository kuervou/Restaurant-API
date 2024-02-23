// src/routes/pagoRoutes.js

const express = require('express')
const router = express.Router()
const pagoController = require('../controllers/pagoController')
const auth = require('../middleware/auth')
const { ROLES } = require('../constants/roles/roles')
const { pagoSchema, querySchema } = require('./validations/pagoValidation')
const { getByCajaIdSchema } = require('./validations/movimientoValidation')
const validate = require('../middleware/validate')

router.post(
    '/pagos',
    auth([ROLES.ADMIN]),
    validate(pagoSchema),
    pagoController.crearPago
)
router.get(
    '/pagos',
    auth([ROLES.ADMIN]),
    validate(querySchema),
    pagoController.getPagos
)
router.get('/pagos/:id', auth([ROLES.ADMIN]), pagoController.getPagoById)
router.get(
    '/pagos/caja/:id',
    auth([ROLES.ADMIN]),
    validate(getByCajaIdSchema),
    pagoController.getPagosByCajaId
)
router.delete('/pagos/:id', auth([ROLES.ADMIN]), pagoController.deletePago)

module.exports = router
