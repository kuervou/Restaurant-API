const { exec } = require('child_process')
const { http } = require('./app')
const port = process.env.PORT || 3000;

// Ejecutar migraciones
if (process.env.NODE_ENV !== 'TEST') {
    //console logs para debug:
    console.log("node env:");
    console.log(process.env.NODE_ENV);



    exec('npx sequelize-cli db:migrate', (error, stdout) => {
        if (error) {
            // eslint-disable-next-line no-console
            console.error('Error ejecutando migraciones:', error)
            return
        }
        // eslint-disable-next-line no-console
        console.log(stdout)

        // Iniciar el servidor después de ejecutar las migraciones
        http.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Aplicación escuchando en http://localhost:${port}`)
        })
    })
} else {
    // Si estás en un ambiente de prueba, simplemente inicia el servidor sin ejecutar migraciones.
    http.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Aplicación escuchando en http://localhost:${port}`)
    })
}
