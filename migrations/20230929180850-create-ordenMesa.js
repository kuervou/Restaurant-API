'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('OrdenMesas', {
            ordenId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Ordenes',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            mesaId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Mesas',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('OrdenMesas')
    },
}
