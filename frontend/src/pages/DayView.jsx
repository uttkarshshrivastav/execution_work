import { useState, useEffect, useCallback } from 'react';
import DayDropdown from '../components/DayDropdown';
import TaskCard from '../components/TaskCard';
import TaskDetailModal from '../components/TaskDetailModal';
import EditTaskModal from '../components/EditTaskModal';
import AddTaskModal from '../components/AddTaskModal';
import AddDayModal from '../components/AddDayModal';
import { getTasksByDay, getDay, updateDayNotes, deleteTask, deleteDay } from '../api/taskApi';

export default function DayView() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddDayModal, setShowAddDayModal] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesMessage, setNotesMessage] = useState({ type: '', text: '' });

  const loadTasks = useCallback((dayNo) => {
    setLoading(true);
    setError(null);
    getTasksByDay(dayNo)
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const loadDayData = useCallback((dayNo) => {
    getDay(dayNo)
      .then(data => setSelectedDayData(data))
      .catch(err => console.error('Failed to load day data:', err));
  }, []);

  useEffect(() => {
    if (selectedDay) {
      loadTasks(selectedDay);
      loadDayData(selectedDay);
    }
  }, [selectedDay, loadTasks, loadDayData]);

  const handleStatusChange = (taskId, updatedTask) => {
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
  };

  const handleDaySelect = (dayNo) => {
    setSelectedDay(dayNo);
    setSelectedTask(null);
    setEditingTask(null);
  };

  const handleAddTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    setShowAddTaskModal(false);
  };

  const handleAddDay = (newDay) => {
    setShowAddDayModal(false);
  };

  const handleEditTask = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      alert('Failed to delete task: ' + err.message);
    }
  };

  const handleDeleteDay = async () => {
    if (!selectedDay) return;
    if (!window.confirm(`Are you sure you want to delete Day ${selectedDay} and ALL its tasks? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteDay(selectedDay);
      setSelectedDay(null);
      setSelectedDayData(null);
      setTasks([]);
      setSelectedTask(null);
      setEditingTask(null);
    } catch (err) {
      alert('Failed to delete day: ' + err.message);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedDay || savingNotes) return;
    setSavingNotes(true);
    setNotesMessage({ type: '', text: '' });
    try {
      const day_notes = selectedDayData?.day_notes || '';
      await updateDayNotes(selectedDay, day_notes);
      setNotesMessage({ type: 'success', text: 'Notes saved!' });
      setTimeout(() => setNotesMessage({ type: '', text: '' }), 2000);
    } catch (err) {
      setNotesMessage({ type: 'error', text: err.message || 'Failed to save notes' });
    } finally {
      setSavingNotes(false);
    }
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setSelectedDayData(prev => prev ? { ...prev, day_notes: newNotes } : { day_notes: newNotes });
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Day View</h1>
          <p className="page-subtitle">Select a day to view and manage tasks</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={() => setShowAddDayModal(true)}>
            + Add Day
          </button>
        </div>
      </header>

      <DayDropdown onSelect={handleDaySelect} defaultDay={selectedDay} />

      {error && (
        <div className="card" style={{ borderColor: '#ff6b6b', color: '#ff6b6b', marginTop: '1rem' }}>
          {error}
        </div>
      )}

      {selectedDay && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <h2 className="section-title mt-3" style={{ marginTop: 0 }}>Day {selectedDay}</h2>
              {selectedDayData && (
                <span className="badge" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                  Week {selectedDayData.week_no}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowAddTaskModal(true)}
                disabled={loading}
              >
                + Add Task
              </button>
              <button 
                className="btn btn-danger btn-sm"
                onClick={handleDeleteDay}
                disabled={loading}
                style={{ 
                  background: 'transparent',
                  border: '1px solid #ff6b6b',
                  color: '#ff6b6b'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ff6b6b';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#ff6b6b';
                }}
              >
                🗑 Delete Day
              </button>
            </div>
          </div>

          {/* Day Notes */}
          {selectedDayData && (
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Day Notes</h3>
              <textarea
                value={selectedDayData.day_notes || ''}
                onChange={handleNotesChange}
                placeholder="Add notes for this day..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  minHeight: '80px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', gap: '0.5rem' }}>
                {notesMessage.text && (
                  <span
                    className={`text-sm ${notesMessage.type === 'success' ? 'status-on_time' : 'status-missed'}`}
                    style={{
                      color: notesMessage.type === 'success' ? '#6bff6b' : '#ff6b6b'
                    }}
                  >
                    {notesMessage.text}
                  </span>
                )}
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                >
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="card text-center text-secondary py-3">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="card text-center text-secondary py-3">
              No tasks for this day
            </div>
          ) : (
            <div className="task-grid mt-2" role="list">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTask(task)}
                  onStatusChange={handleStatusChange}
                  onEdit={() => setEditingTask(task)}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </>
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleEditTask}
        />
      )}

      {showAddTaskModal && selectedDay && selectedDayData && (
        <AddTaskModal
          dayNo={selectedDay}
          weekNo={selectedDayData.week_no}
          onClose={() => setShowAddTaskModal(false)}
          onSave={handleAddTask}
        />
      )}

      {showAddDayModal && (
        <AddDayModal
          onClose={() => setShowAddDayModal(false)}
          onSave={handleAddDay}
        />
      )}
    </div>
  );
}