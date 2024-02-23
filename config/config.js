/* eslint-disable no-console */
require('dotenv').config()

/* // Por ejemplo: 'development', 'production', 'test', etc.
VERIFICANDO VARIABLES DE ENTORNO 
console.log("hola");
console.log(process.env.NODE_ENV);
console.log(process.env.LOCAL_DB_HOST);
console.log(`${env}_DB_HOST`);
console.log(process.env[`${env}_DB_NAME`]);*/
console.log("hola desde config");
console.log(process.env.NODE_ENV);
const env = process.env.NODE_ENV;
console.log(`${env}_DB_HOST`);


module.exports = {
    DEVELOPMENT: {
        username: process.env.DEVELOPMENT_DB_USER,
        password: process.env.DEVELOPMENT_DB_PASS,
        database: process.env.DEVELOPMENT_DB_NAME,
        host: process.env.DEVELOPMENT_DB_HOST,
        dialect: 'mysql',
    },
    TEST: {
        username: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASS,
        database: process.env.TEST_DB_NAME,
        host: process.env.TEST_DB_HOST,
        dialect: 'mysql',
    },
    LOCAL: {
        username: process.env.LOCAL_DB_USER,
        password: process.env.LOCAL_DB_PASS,
        database: process.env.LOCAL_DB_NAME,
        host: process.env.LOCAL_DB_HOST,
        dialect: 'mysql',
        logging: console.log,
    },
    PRODUCTION: {
        // Configuración específica para Google Cloud SQL en producción
        username: process.env.PRODUCTION_DB_USER,
        password: process.env.PRODUCTION_DB_PASS,
        database: process.env.PRODUCTION_DB_NAME,
        dialect: 'mysql',
        dialectOptions: {
            socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
        },
        logging: false, // Puedes desactivar el logging en producción si lo prefieres
    },

}
