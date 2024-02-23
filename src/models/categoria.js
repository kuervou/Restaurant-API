// src/models/categoria.js
'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Categoria extends Model {
        static associate(models) {
            Categoria.hasMany(models.ItemInventario, {
                foreignKey: 'categoriaId',
            })
        }
    }
    Categoria.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nombre: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Categoria',
            tableName: 'Categorias',
        }
    )
    return Categoria
}
