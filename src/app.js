/* eslint-disable no-console */

const express = require('express')
const cors = require('cors')
const app = express()

// Imports
const db = require('./models')
const configureRoutes = require('./routes')
const socketHandler = require('./webSocket/socketHandler')
const errorHandler = require('./error-handling/errorHandler')

// Instancia Socket.io
const http = require('http').Server(app)
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

// Middleware para cors y parseo de req
app.use(cors())
app.use(express.json({ limit: '10mb' })) // Puedes ajustar '10mb' según tus necesidades

// Middleware para adjuntar `io` al objeto `req`
app.use((req, res, next) => {
    req.io = io
    next()
})

// Configurar rutas
configureRoutes(app, io)

// Configurar Socket.io
socketHandler(io)

app.use(errorHandler)

module.exports = { app, http, io, db }
