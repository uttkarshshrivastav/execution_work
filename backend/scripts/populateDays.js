const sequelize = require('../config/db');
const Task = require('../models/Task');
const Day = require('../models/Day');

async function populateDays() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const tasks = await Task.findAll({
      attributes: ['day_no', 'week_no', 'phase', 'day_type'],
      group: ['day_no', 'week_no', 'phase', 'day_type'],
      raw: true,
    });

    console.log(`Found ${tasks.length} distinct days`);

    for (const task of tasks) {
      await Day.findOrCreate({
        where: { day_no: task.day_no },
        defaults: {
          day_no: task.day_no,
          week_no: task.week_no,
          phase: task.phase,
          day_type: task.day_type,
        },
      });
    }

    console.log('Days populated successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

populateDays();