import { useState } from 'react';
import { createTask } from '../api/taskApi';

const FIELDS = [
  { name: 'day_no', label: 'Day No *', type: 'number', required: true },
  { name: 'week_no', label: 'Week No *', type: 'number', required: true },
  { name: 'phase', label: 'Phase', type: 'text' },
  { name: 'day_type', label: 'Day Type', type: 'text' },
  { name: 'tier', label: 'Tier', type: 'text' },
  { name: 'category', label: 'Category', type: 'text' },
  { name: 'task_type', label: 'Task Type', type: 'text' },
  { name: 'deliverable', label: 'Deliverable *', type: 'textarea', required: true },
  { name: 'estimated_hours', label: 'Estimated Hours', type: 'number', step: '0.5' },
  { name: 'day_total_hours', label: 'Day Total Hours', type: 'number', step: '0.5' },
  { name: 'points_ontime', label: 'Points (On Time)', type: 'number' },
  { name: 'points_late', label: 'Points (Late)', type: 'number' },
  { name: 'points_missed', label: 'Points (Missed)', type: 'number' },
  { name: 'notes', label: 'Notes', type: 'textarea' },
];

export default function AddTaskForm() {
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.day_no || !formData.week_no || !formData.deliverable) {
      setMessage({ type: 'error', text: 'Day No, Week No, and Deliverable are required' });
      return;
    }

    setSubmitting(true);
    try {
      await createTask(formData);
      setMessage({ type: 'success', text: 'Task created successfully!' });
      setFormData({});
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to create task' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="section-title">Add New Task</h2>
      
      {message.text && (
        <div
          className={`text-center py-2 ${message.type === 'success' ? 'status-on_time' : 'status-missed'}`}
          style={{
            background: message.type === 'success' ? '#1a2d1a' : '#2d1a1a',
            borderRadius: '6px',
            marginBottom: '1rem',
            color: message.type === 'success' ? '#6bff6b' : '#ff6b6b'
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {FIELDS.map(({ name, label, type, required, step }) => (
            <div key={name} className="form-group">
              <label htmlFor={name}>{label}</label>
              {type === 'textarea' ? (
                <textarea
                  id={name}
                  name={name}
                  value={formData[name] || ''}
                  onChange={handleChange}
                  required={required}
                  rows={3}
                  style={{ minHeight: '80px' }}
                />
              ) : (
                <input
                  id={name}
                  name={name}
                  type={type || 'text'}
                  step={step}
                  value={formData[name] ?? ''}
                  onChange={handleChange}
                  required={required}
                />
              )}
            </div>
          ))}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Task'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setFormData({})}
            disabled={submitting}
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}