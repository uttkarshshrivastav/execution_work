const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  day_no: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  tier: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  task_type: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  deliverable: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estimated_hours: {
    type: DataTypes.NUMERIC,
    allowNull: true,
  },
  day_total_hours: {
    type: DataTypes.NUMERIC,
    allowNull: true,
  },
  points_ontime: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  points_late: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  points_missed: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('not_started', 'on_time', 'late', 'missed'),
    defaultValue: 'not_started',
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'tasks',
  timestamps: false,
  underscored: true,
});

module.exports = Task;