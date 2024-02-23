// src/seeders/20231010211318-grupo-seeder.js

'use strict'

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'Grupos',
            [
                {
                    nombre: 'tragos',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nombre: 'bebidas',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nombre: 'Grupo C',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Grupos', null, {})
    },
}
