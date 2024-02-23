// src/models/mesa.js

'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Mesa extends Model {
        static associate(models) {
            // Muchas mesas pueden estar asociadas con muchas órdenes
            // a través de la tabla OrdenMesa.
            Mesa.belongsToMany(models.Orden, {
                through: 'OrdenMesa',
                foreignKey: 'mesaId',
                as: 'ordenes',
            })
        }
    }

    Mesa.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nroMesa: {
                type: DataTypes.INTEGER,
                unique: true,
                allowNull: false,
            },
            libre: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: 'Mesa',
            timestamps: true,
        }
    )

    return Mesa
}
