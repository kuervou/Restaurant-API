// src/models/ordenMesa.js

'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class OrdenMesa extends Model {}

    OrdenMesa.init(
        {
            ordenId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Ordenes',
                    key: 'id',
                },
            },
            mesaId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Mesas',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'OrdenMesa',
            timestamps: true,
        }
    )

    return OrdenMesa
}
