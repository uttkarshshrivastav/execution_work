const { readFileSync } = require('fs');
const { parse } = require('csv-parse/sync');
const sequelize = require('../config/db');
const Task = require('../models/Task');

const CSV_PATH = "C:\\\\Users\\\\vivek\\\\Desktop\\\\execution_work\\\\3month_plan.csv";

async function importCsv() {
  try {
    const fileContent = readFileSync(CSV_PATH, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const rows = records.map(row => ({
      day_no: parseInt(row.day_no, 10),
      week_no: parseInt(row.week_no, 10),
      phase: row.phase || null,
      day_type: row.day_type || null,
      tier: row.tier || null,
      category: row.category || null,
      task_type: row.task_type || null,
      deliverable: row.deliverable || null,
      estimated_hours: row.estimated_hours ? parseFloat(row.estimated_hours) : null,
      day_total_hours: row.day_total_hours ? parseFloat(row.day_total_hours) : null,
      points_ontime: row.points_ontime ? parseInt(row.points_ontime, 10) : null,
      points_late: row.points_late ? parseInt(row.points_late, 10) : null,
      points_missed: row.points_missed ? parseInt(row.points_missed, 10) : null,
      notes: row.notes || null,
      status: row.status || 'not_started',
    }));

    await sequelize.authenticate();
    await Task.bulkCreate(rows);
    console.log(`Inserted ${rows.length} rows (CSV had ${records.length} rows)`);
    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err.message);
    process.exit(1);
  }
}

importCsv();