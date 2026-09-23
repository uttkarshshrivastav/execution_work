import { useEffect, useState } from 'react';
import { getDays } from '../api/taskApi';

export default function DayDropdown({ onSelect, defaultDay }) {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    getDays()
      .then(data => {
        if (mounted) {
          setDays(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="dropdown-wrapper">
        <select className="dropdown-select" disabled>
          <option>Loading days...</option>
        </select>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dropdown-wrapper">
        <p className="text-secondary">Error loading days: {error}</p>
      </div>
    );
  }

  return (
    <div className="dropdown-wrapper">
      <label className="dropdown-label" htmlFor="day-select">Select Day</label>
      <select
        id="day-select"
        className="dropdown-select"
        value={defaultDay || ''}
        onChange={e => onSelect(Number(e.target.value))}
        aria-label="Select day"
      >
        <option value="">-- Choose a day --</option>
        {days.map(day => (
          <option key={day.day_no} value={day.day_no}>
            Day {day.day_no} — {day.phase} ({day.day_type})
          </option>
        ))}
      </select>
    </div>
  );
}