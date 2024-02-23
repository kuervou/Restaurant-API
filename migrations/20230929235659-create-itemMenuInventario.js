'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ItemsMenuInventario', {
            itemMenuId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'ItemsMenu',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            itemInventarioId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                references: {
                    model: 'ItemsInventario',
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
        await queryInterface.dropTable('ItemsMenuInventario')
    },
}
