const express = require('express')
const router = express.Router()
const cajaController = require('../controllers/cajaController')
const validate = require('../middleware/validate')
const { cajaSchema } = require('./validations/cajaValidation')
const auth = require('../middleware/auth')
const { ROLES } = require('../constants/roles/roles')

router.post(
    '/cajas',
    [auth([ROLES.ADMIN]), validate(cajaSchema)],
    cajaController.crearCaja
)
router.get('/cajas', auth([ROLES.ADMIN]), cajaController.getCajas)
router.get('/cajas/:id', auth([ROLES.ADMIN]), cajaController.getCajaById)
router.put(
    '/cajas/:id',
    [auth([ROLES.ADMIN]), validate(cajaSchema)],
    cajaController.updateCaja
)
router.delete('/cajas/:id', auth([ROLES.ADMIN]), cajaController.deleteCaja)

module.exports = router
