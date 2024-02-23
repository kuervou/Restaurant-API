// src/seeders/20231010211418-categoria-seeder.js

'use strict'

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert(
            'Categorias',
            [
                {
                    nombre: 'Categoria 1',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nombre: 'Categoria 2',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nombre: 'Categoria 3',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Categorias', null, {})
    },
}
