const Task = require('../models/Task');
const { Op, fn, col, literal } = require('sequelize');

exports.getScorecard = async (req, res) => {
  try {
    const tasks = await Task.findAll({ raw: true });

    let totalEarned = 0;
    let totalPossible = 0;
    const byWeek = {};

    for (const task of tasks) {
      const possible = task.points_ontime || 0;
      totalPossible += possible;

      let earned = 0;
      if (task.status === 'on_time') earned = task.points_ontime || 0;
      else if (task.status === 'late') earned = task.points_late || 0;
      else if (task.status === 'missed') earned = task.points_missed || 0;

      totalEarned += earned;

      const weekNo = task.week_no;
      if (!byWeek[weekNo]) {
        byWeek[weekNo] = { earned: 0, possible: 0 };
      }
      byWeek[weekNo].earned += earned;
      byWeek[weekNo].possible += possible;
    }

    const byWeekArray = Object.entries(byWeek)
      .map(([week_no, data]) => ({
        week_no: parseInt(week_no, 10),
        earned: data.earned,
        possible: data.possible,
      }))
      .sort((a, b) => a.week_no - b.week_no);

    res.json({
      total_earned: totalEarned,
      total_possible: totalPossible,
      percentage: totalPossible > 0 ? parseFloat(((totalEarned / totalPossible) * 100).toFixed(1)) : 0,
      by_week: byWeekArray,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { granularity } = req.query;
    if (!['day', 'week', 'month'].includes(granularity)) {
      return res.status(400).json({ error: 'granularity must be day, week, or month' });
    }

    const tasks = await Task.findAll({ raw: true });

    const grouped = {};

    for (const task of tasks) {
      const possible = task.points_ontime || 0;
      let earned = 0;
      if (task.status === 'on_time') earned = task.points_ontime || 0;
      else if (task.status === 'late') earned = task.points_late || 0;
      else if (task.status === 'missed') earned = task.points_missed || 0;

      let label;
      if (granularity === 'day') {
        label = String(task.day_no);
      } else if (granularity === 'week') {
        label = `Week ${task.week_no}`;
      } else {
        const monthNo = Math.ceil(task.week_no / 4);
        label = `Month ${monthNo}`;
      }

      if (!grouped[label]) {
        grouped[label] = { earned: 0, possible: 0 };
      }
      grouped[label].earned += earned;
      grouped[label].possible += possible;
    }

    const result = Object.entries(grouped)
      .map(([label, data]) => ({
        label,
        earned: data.earned,
        possible: data.possible,
        percentage: data.possible > 0 ? parseFloat(((data.earned / data.possible) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => {
        const numA = parseInt(a.label.replace(/\D/g, ''), 10);
        const numB = parseInt(b.label.replace(/\D/g, ''), 10);
        return numA - numB;
      });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};