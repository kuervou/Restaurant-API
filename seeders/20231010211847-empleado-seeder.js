// src/seeders/20231010211847-empleado-seeder.js

'use strict'
const bcrypt = require('bcrypt')

module.exports = {
    up: async (queryInterface) => {
        const password = await bcrypt.hash('password123', 10) // 'password123' es la contraseña de ejemplo

        await queryInterface.bulkInsert(
            'Empleados',
            [
                {
                    nombre: 'Juan',
                    apellido: 'Pérez',
                    telefono: '12345678',
                    nick: 'juanito',
                    password: password,
                    rol: 'Mozo',
                    activo: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nombre: 'Juana',
                    apellido: 'Ramírez',
                    telefono: '78901234',
                    nick: 'juanita',
                    password: password,
                    rol: 'Cocina',
                    activo: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nombre: 'Felipe',
                    apellido: 'Prince',
                    telefono: '34526789',
                    nick: 'pipe',
                    password: password,
                    rol: 'Admin',
                    activo: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Empleados', null, {})
    },
}
