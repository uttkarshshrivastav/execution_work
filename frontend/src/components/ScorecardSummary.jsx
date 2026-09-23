import { useEffect, useState } from 'react';
import { getScorecard } from '../api/taskApi';

export default function ScorecardSummary() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    getScorecard()
      .then(result => {
        if (mounted) {
          setData(result);
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
      <div className="card">
        <h2 className="section-title">Scorecard</h2>
        <div className="text-center text-secondary py-3">Loading scorecard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card">
        <h2 className="section-title">Scorecard</h2>
        <div className="text-center text-secondary py-3">Error loading scorecard</div>
      </div>
    );
  }

  const { total_earned, total_possible, percentage, by_week } = data;
  const pct = percentage?.toFixed(1) ?? '0.0';

  return (
    <div className="card">
      <h2 className="section-title">Scorecard</h2>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={{ textAlign: 'center', minWidth: '120px' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
            {formatNumber(total_earned)}
          </div>
          <div className="text-secondary text-sm">Earned</div>
        </div>
        
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span className="text-secondary">Progress</span>
            <span style={{ fontWeight: 600 }}>{pct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}></div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', minWidth: '120px' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
            {formatNumber(total_possible)}
          </div>
          <div className="text-secondary text-sm">Possible</div>
        </div>
      </div>

      {by_week && by_week.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Week</th>
                <th>Earned</th>
                <th>Possible</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {by_week.map((week, idx) => {
                const weekPct = week.possible > 0 ? ((week.earned / week.possible) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={week.week_no ?? idx}>
                    <td>Week {week.week_no}</td>
                    <td>{formatNumber(week.earned)}</td>
                    <td>{formatNumber(week.possible)}</td>
                    <td><span className="status-badge status-on_time">{weekPct}%</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatNumber(val) {
  if (val === null || val === undefined) return '—';
  return Number(val).toLocaleString();
}