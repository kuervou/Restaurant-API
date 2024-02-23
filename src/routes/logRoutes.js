// src/routes/botellaRoutes.js
const express = require('express')
const router = express.Router()
const logController = require('../controllers/logController')
const auth = require('../middleware/auth')
const { ROLES } = require('../constants/roles/roles')
const validate = require('../middleware/validate')
const {
    abrirBotellaSchema,
    cerrarBotellaSchema,
    logQuerySchema,
} = require('./validations/logValidations')

router.post(
    '/log/abrirBotella',
    auth([ROLES.ADMIN]),
    validate(abrirBotellaSchema),
    logController.abrirBotella
)
router.post(
    '/log/cerrarBotella',
    auth([ROLES.ADMIN]),
    validate(cerrarBotellaSchema),
    logController.cerrarBotella
)
router.get(
    '/logs/:itemInventarioId',
    auth([ROLES.ADMIN]),
    validate(logQuerySchema),
    logController.getLogs
)

module.exports = router
