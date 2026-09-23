import { useState } from 'react';
import { updateTaskStatus } from '../api/taskApi';

const STATUSES = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'on_time', label: 'On Time' },
  { value: 'late', label: 'Late' },
  { value: 'missed', label: 'Missed' }
];

export default function StatusSelector({ currentStatus, taskId, onChange }) {
  const [updating, setUpdating] = useState(false);

  const handleChange = async (newStatus) => {
    if (newStatus === currentStatus || updating) return;
    setUpdating(true);
    try {
      const updatedTask = await updateTaskStatus(taskId, newStatus);
      onChange(updatedTask);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="status-selector-inline" role="group" aria-label="Task status">
      {STATUSES.map(({ value, label }) => (
        <button
          key={value}
          className={`status-btn ${value === currentStatus ? 'active' : ''}`}
          onClick={() => handleChange(value)}
          disabled={updating}
          aria-pressed={value === currentStatus}
          title={label}
        >
          {label}
        </button>
      ))}
    </div>
  );
}