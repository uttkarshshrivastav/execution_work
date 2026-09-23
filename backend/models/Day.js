const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Day = sequelize.define('Day', {
  day_no: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false,
  },
  week_no: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phase: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  day_type: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  day_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'days',
  timestamps: false,
  underscored: true,
});

module.exports = Day;