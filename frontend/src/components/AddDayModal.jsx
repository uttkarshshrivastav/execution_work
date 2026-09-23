import { useState, useEffect } from 'react';
import { createDay } from '../api/taskApi';

export default function AddDayModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    day_no: '',
    week_no: '',
    phase: '',
    day_type: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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

    if (!formData.day_no || !formData.week_no) {
      setMessage({ type: 'error', text: 'Day No and Week No are required' });
      return;
    }

    setSubmitting(true);
    try {
      const newDay = await createDay(formData);
      setMessage({ type: 'success', text: 'Day created successfully!' });
      onSave(newDay);
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to create day' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="add-day-modal-title">
      <div className="modal-content" style={{ maxWidth: '500px', width: '90%' }}>
        <header className="modal-header">
          <h2 id="add-day-modal-title" className="app-title">Add New Day</h2>
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
              <div className="form-group">
                <label htmlFor="day_no">Day No *</label>
                <input
                  id="day_no"
                  name="day_no"
                  type="number"
                  value={formData.day_no ?? ''}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label htmlFor="week_no">Week No *</label>
                <input
                  id="week_no"
                  name="week_no"
                  type="number"
                  value={formData.week_no ?? ''}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phase">Phase</label>
                <input
                  id="phase"
                  name="phase"
                  type="text"
                  value={formData.phase || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="day_type">Day Type</label>
                <input
                  id="day_type"
                  name="day_type"
                  type="text"
                  value={formData.day_type || ''}
                  onChange={handleChange}
                />
              </div>
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
              {submitting ? 'Creating...' : 'Create Day'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}