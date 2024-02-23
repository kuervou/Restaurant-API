// src/models/grupo.js

'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Grupo extends Model {
        static associate(models) {
            Grupo.hasMany(models.ItemMenu, {
                foreignKey: 'grupoId',
                as: 'grupo',
            })
        }
    }

    Grupo.init(
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
            esBebida: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Grupo',
            timestamps: true,
        }
    )

    return Grupo
}
