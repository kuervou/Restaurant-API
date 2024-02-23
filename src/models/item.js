// src/models/item.js

'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Item extends Model {
        static associate(models) {
            Item.belongsTo(models.Orden, {
                foreignKey: 'ordenId',
                as: 'orden',
            })
            Item.belongsTo(models.ItemMenu, {
                foreignKey: 'itemMenuId',
                as: 'itemMenu',
            })
        }
    }

    Item.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            ordenId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Ordenes',
                    key: 'id',
                },
            },
            itemMenuId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'ItemsMenu',
                    key: 'id',
                },
            },
            cantidad: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            precio: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Item',
            timestamps: true,
        }
    )

    return Item
}
