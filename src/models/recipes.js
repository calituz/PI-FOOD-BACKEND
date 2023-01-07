const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('recipes', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      //allowNull: false,
      primaryKey: true
    },
    image: {
      type: DataTypes.TEXT,
      //allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    summary: {
      type: DataTypes.TEXT,
    },
    healthScore: {
      type: DataTypes.INTEGER
    },
    analyzedInstructions: {
      type: DataTypes.TEXT,
    },
    createdInDb: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  },
    { timestamps: false });
};

