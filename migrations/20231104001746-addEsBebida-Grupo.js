'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Grupos', 'esBebida', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false, // Aquí puedes establecer un valor predeterminado si es necesario
        })
    },

    down: async (queryInterface) => {
        await queryInterface.removeColumn('Grupos', 'esBebida')
    },
}
