// src/models/cliente.js
'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Cliente extends Model {
        static associate(models) {
            // Relación uno a muchos con Orden
            Cliente.hasMany(models.Orden, {
                foreignKey: 'clienteId',
                as: 'ordenes',
            })
        }
    }
    Cliente.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            apellido: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            telefono: DataTypes.STRING,
            cuenta: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'Cliente',
            timestamps: true,
        }
    )
    return Cliente
}
