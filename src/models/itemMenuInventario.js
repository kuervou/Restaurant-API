// src/models/itemMenuInventario.js

'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class ItemMenuInventario extends Model {}

    ItemMenuInventario.init(
        {
            itemMenuId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: 'ItemsMenu',
                    key: 'id',
                },
            },
            itemInventarioId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: 'ItemsInventario',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'ItemMenuInventario',
            tableName: 'ItemsMenuInventario', //porque sequelize sino va a buscar la tabla "ItemMenuInventarios"
            timestamps: true,
        }
    )

    return ItemMenuInventario
}
