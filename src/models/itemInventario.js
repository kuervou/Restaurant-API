// src/models/itemInventario.js
'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class ItemInventario extends Model {
        static associate(models) {
            ItemInventario.belongsTo(models.Categoria, {
                as: 'categoria',
                foreignKey: 'categoriaId', //usamos el alias para poder hacer referencia en "getItemInventarioById" del repository
            })
            ItemInventario.hasMany(models.Log, {
                foreignKey: 'itemInventarioId',
            })
            ItemInventario.hasMany(models.Compra, {
                foreignKey: 'itemInventarioId',
            })
            ItemInventario.belongsToMany(models.ItemMenu, {
                through: 'ItemMenuInventario',
                foreignKey: 'itemInventarioId',
                as: 'itemMenus',
            })
        }
    }
    ItemInventario.init(
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
            descripcion: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            costo: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            porUnidad: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            categoriaId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Categorias',
                    key: 'id',
                },
                allowNull: false,
            },
            cantxCasillero: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'ItemInventario',
            tableName: 'ItemsInventario', //porque sequelize sino va a buscar la tabla "ItemInventarios"
            timestamps: true,
        }
    )
    return ItemInventario
}
