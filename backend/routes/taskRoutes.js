const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/days', taskController.getDays);
router.post('/days', taskController.createDay);
router.get('/days/:dayNo', taskController.getDayById);
router.patch('/days/:dayNo/notes', taskController.updateDayNotes);
router.delete('/days/:dayNo', taskController.deleteDay);
router.get('/days/:dayNo/tasks', taskController.getTasksByDay);
router.get('/tasks/:id', taskController.getTaskById);
router.patch('/tasks/:id/status', taskController.updateTaskStatus);
router.patch('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
router.post('/tasks', taskController.createTask);

module.exports = router;