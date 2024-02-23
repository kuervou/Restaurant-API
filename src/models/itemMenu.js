// src/models/itemMenu.js

'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class ItemMenu extends Model {
        static associate(models) {
            ItemMenu.belongsTo(models.Grupo, {
                foreignKey: 'grupoId',
                as: 'grupo',
            })
            ItemMenu.belongsToMany(models.ItemInventario, {
                through: 'ItemMenuInventario',
                foreignKey: 'itemMenuId',
            })

            ItemMenu.hasMany(models.Item, {
                foreignKey: 'itemMenuId',
                as: 'items',
            })
        }
    }

    ItemMenu.init(
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
            descripcion: DataTypes.STRING,
            precio: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            imagen: {
                type: DataTypes.BLOB,
                allowNull: false,
            },
            activo: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            grupoId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Grupos',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'ItemMenu',
            tableName: 'ItemsMenu',
            timestamps: true,
        }
    )

    return ItemMenu
}
