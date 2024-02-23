'use strict'

// Importaciones requeridas
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'DEVELOPMENT'
const config = require(__dirname + '/../../config/config.js')[env]
const db = {}



// Inicialización de Sequelize con la configuración para el entorno actual
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Leer todos los archivos de modelo en el directorio actual
fs.readdirSync(__dirname)
    .filter((file) => {
        // Filtrar archivos que no sean modelos
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        )
    })
    .forEach((file) => {
        // Importar cada modelo y añadirlo al objeto `db`
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        )
        db[model.name] = model
    })

// Invocar el método 'associate' en cada modelo si existe
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

// Exportar el objeto `db` con todos los modelos y la instancia de Sequelize
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
