import StatusSelector from './StatusSelector';

const categoryStyles = {
  Technical: 'category-Technical',
  Outreach: 'category-Outreach',
  Admin: 'category-Admin',
  Custom: 'category-Custom'
};

const TrashIcon = ({ className = '', onClick, ...props }) => (
  <svg
    className={className}
    onClick={onClick}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

export default function TaskCard({ task, onClick, onStatusChange, onEdit, onDelete }) {
  const categoryClass = categoryStyles[task.category] || 'category-Custom';

  const truncate = (str, len = 80) => {
    if (!str) return '';
    return str.length > len ? str.slice(0, len) + '...' : str;
  };

  return (
    <article className={`card task-card`} role="listitem" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="task-card-header">
        <span className={`task-card-category badge ${categoryClass}`}>
          {task.category}
        </span>
        <span className="task-card-hours">
          <span>{task.estimated_hours}</span>h
        </span>
      </div>
      <p className="task-card-deliverable" onClick={onClick} style={{ cursor: 'pointer' }}>{truncate(task.deliverable)}</p>
      <div className="task-card-footer">
        <span className="text-xs text-secondary">
          {task.task_type} • {task.tier}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StatusSelector
            currentStatus={task.status}
            taskId={task.id}
            onChange={updatedTask => onStatusChange(task.id, updatedTask)}
          />
          {onEdit && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              title="Edit task"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              className="btn btn-danger btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this task?')) {
                  onDelete(task.id);
                }
              }}
              title="Delete task"
              style={{ 
                padding: '0.25rem 0.5rem', 
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
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
              <TrashIcon />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}