// socketHandler.js

module.exports = function (io) {
    io.on('connection', (socket) => {
        // eslint-disable-next-line no-console
        console.log('Un usuario se ha conectado con ID:', socket.id)

        socket.on('disconnect', () => {
            // eslint-disable-next-line no-console
            console.log('Usuario desconectado con ID:', socket.id)
        })
    })
}
