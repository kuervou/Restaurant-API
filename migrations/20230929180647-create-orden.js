'use strict'
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Ordenes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            fecha: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            hora: {
                type: Sequelize.TIME,
                allowNull: false,
            },
            total: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },
            responsable: {
                type: Sequelize.STRING,
            },
            estado: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            ocupacion: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            observaciones: {
                type: Sequelize.STRING,
            },
            paga: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            clienteId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Clientes',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            empleadoId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Empleados',
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
        await queryInterface.dropTable('Ordenes')
    },
}
