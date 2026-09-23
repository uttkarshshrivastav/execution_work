import { useEffect } from 'react';

const formatTimestamp = (ts) => {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
};

const formatNumber = (val) => {
  if (val === null || val === undefined) return '—';
  return Number(val).toLocaleString();
};

const FIELD_CONFIG = [
  { key: 'deliverable', label: 'Deliverable', fullWidth: true },
  { key: 'category', label: 'Category' },
  { key: 'task_type', label: 'Task Type' },
  { key: 'tier', label: 'Tier' },
  { key: 'estimated_hours', label: 'Estimated Hours', format: formatNumber },
  { key: 'day_total_hours', label: 'Day Total Hours', format: formatNumber },
  { key: 'points_ontime', label: 'Points (On Time)', format: formatNumber },
  { key: 'points_late', label: 'Points (Late)', format: formatNumber },
  { key: 'points_missed', label: 'Points (Missed)', format: formatNumber },
  { key: 'status', label: 'Status', format: (v) => v?.replace('_', ' ')?.replace(/\b\w/g, c => c.toUpperCase()) },
  { key: 'completed_at', label: 'Completed At', format: formatTimestamp },
  { key: 'day_no', label: 'Day No', format: formatNumber },
  { key: 'week_no', label: 'Week No', format: formatNumber },
  { key: 'phase', label: 'Phase' },
  { key: 'day_type', label: 'Day Type' },
  { key: 'notes', label: 'Notes', fullWidth: true },
  { key: 'id', label: 'ID', format: formatNumber }
];

export default function TaskDetailModal({ task, onClose }) {
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        <header className="modal-header">
          <h2 id="modal-title" className="app-title">Task Details</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">&times;</button>
        </header>
        <div className="modal-body">
          {task.deliverable && (
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.5 }}>{task.deliverable}</p>
            </div>
          )}
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {FIELD_CONFIG.map(({ key, label, format, fullWidth }) => {
              const value = task[key];
              if (value === null || value === undefined || value === 'NULL') return null;
              const formatted = format ? format(value) : value;
              return (
                <div
                  key={key}
                  className="field-row"
                  style={fullWidth ? { gridColumn: '1 / -1', justifyContent: 'flex-start', textAlign: 'left' } : {}}
                >
                  <span className="field-label">{label}</span>
                  <span className="field-value" style={fullWidth ? { textAlign: 'left', width: '100%', marginTop: '0.25rem' } : {}}>
                    {key === 'status' && (
                      <span className={`status-badge status-${value}`}>{formatted}</span>
                    )}
                    {key !== 'status' && formatted}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}