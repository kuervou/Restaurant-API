'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ItemsMenu', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            Nombre: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            Descripcion: Sequelize.STRING,
            Precio: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            Imagen: {
                type: Sequelize.BLOB,
                allowNull: false,
            },
            Activo: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            grupoId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Grupos',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
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
        await queryInterface.dropTable('ItemsMenu')
    },
}
