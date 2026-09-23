const Task = require('../models/Task');
const Day = require('../models/Day');

const VALID_STATUSES = ['not_started', 'on_time', 'late', 'missed'];

exports.getDays = async (req, res) => {
  try {
    const days = await Day.findAll({
      order: [['day_no', 'ASC']],
      raw: true,
    });
    res.json(days);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTasksByDay = async (req, res) => {
  try {
    const dayNo = parseInt(req.params.dayNo, 10);
    if (isNaN(dayNo)) {
      return res.status(400).json({ error: 'Invalid day_no' });
    }
    const tasks = await Task.findAll({
      where: { day_no: dayNo },
      order: [['id', 'ASC']],
      raw: true,
    });
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found for this day' });
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDayById = async (req, res) => {
  try {
    const dayNo = parseInt(req.params.dayNo, 10);
    if (isNaN(dayNo)) {
      return res.status(400).json({ error: 'Invalid day_no' });
    }
    const day = await Day.findByPk(dayNo);
    if (!day) {
      return res.status(404).json({ error: 'Day not found' });
    }
    res.json(day);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.status = status;
    task.completed_at = status === 'not_started' ? null : new Date();
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const allowedFields = [
      'day_no', 'week_no', 'phase', 'day_type', 'tier', 'category',
      'task_type', 'deliverable', 'estimated_hours', 'day_total_hours',
      'points_ontime', 'points_late', 'points_missed', 'notes'
    ];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    }
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { day_no, week_no, deliverable } = req.body;
    if (day_no === undefined || week_no === undefined || !deliverable) {
      return res.status(400).json({ error: 'day_no, week_no, and deliverable are required' });
    }

    await Day.findOrCreate({
      where: { day_no },
      defaults: {
        day_no,
        week_no,
        phase: req.body.phase || null,
        day_type: req.body.day_type || null,
      },
    });

    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDayNotes = async (req, res) => {
  try {
    const dayNo = parseInt(req.params.dayNo, 10);
    if (isNaN(dayNo)) {
      return res.status(400).json({ error: 'Invalid day_no' });
    }
    const { day_notes } = req.body;
    const day = await Day.findByPk(dayNo);
    if (!day) {
      return res.status(404).json({ error: 'Day not found' });
    }
    day.day_notes = day_notes;
    await day.save();
    res.json(day);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDay = async (req, res) => {
  try {
    const { day_no, week_no, phase, day_type } = req.body;
    if (day_no === undefined || week_no === undefined) {
      return res.status(400).json({ error: 'day_no and week_no are required' });
    }
    const day = await Day.create({ day_no, week_no, phase, day_type });
    res.status(201).json(day);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await task.destroy();
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDay = async (req, res) => {
  try {
    const dayNo = parseInt(req.params.dayNo, 10);
    if (isNaN(dayNo)) {
      return res.status(400).json({ error: 'Invalid day_no' });
    }
    // Delete all tasks for this day first
    await Task.destroy({ where: { day_no: dayNo } });
    // Delete the day
    const day = await Day.findByPk(dayNo);
    if (!day) {
      return res.status(404).json({ error: 'Day not found' });
    }
    await day.destroy();
    res.json({ success: true, message: 'Day and all its tasks deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};