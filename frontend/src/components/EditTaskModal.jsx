import { useState, useEffect } from 'react';
import { updateTask } from '../api/taskApi';

const FIELDS = [
  { name: 'deliverable', label: 'Deliverable *', type: 'textarea', required: true },
  { name: 'category', label: 'Category', type: 'text' },
  { name: 'task_type', label: 'Task Type', type: 'text' },
  { name: 'tier', label: 'Tier', type: 'text' },
  { name: 'estimated_hours', label: 'Estimated Hours', type: 'number', step: '0.5' },
  { name: 'day_total_hours', label: 'Day Total Hours', type: 'number', step: '0.5' },
  { name: 'points_ontime', label: 'Points (On Time)', type: 'number' },
  { name: 'points_late', label: 'Points (Late)', type: 'number' },
  { name: 'points_missed', label: 'Points (Missed)', type: 'number' },
  { name: 'notes', label: 'Notes', type: 'textarea' },
];

export default function EditTaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

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

    if (!formData.deliverable) {
      setMessage({ type: 'error', text: 'Deliverable is required' });
      return;
    }

    setSubmitting(true);
    try {
      const updatedTask = await updateTask(task.id, formData);
      setMessage({ type: 'success', text: 'Task updated successfully!' });
      onSave(updatedTask);
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update task' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
      <div className="modal-content" style={{ maxWidth: '600px', width: '90%' }}>
        <header className="modal-header">
          <h2 id="edit-modal-title" className="app-title">Edit Task</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal" disabled={submitting}>&times;</button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
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

            <div style={{ display: 'grid', gap: '1rem' }}>
              {FIELDS.map(({ name, label, type, required, step }) => (
                <div key={name} className="form-group">
                  <label htmlFor={`edit-${name}`}>{label}</label>
                  {type === 'textarea' ? (
                    <textarea
                      id={`edit-${name}`}
                      name={name}
                      value={formData[name] || ''}
                      onChange={handleChange}
                      required={required}
                      rows={3}
                      style={{ minHeight: '80px' }}
                    />
                  ) : (
                    <input
                      id={`edit-${name}`}
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
          </div>
          <footer className="modal-footer" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border)', marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}