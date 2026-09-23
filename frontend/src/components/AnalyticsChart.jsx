import { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getAnalytics } from '../api/taskApi';

export default function AnalyticsChart() {
  const [granularity, setGranularity] = useState('day');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAnalytics(granularity);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [granularity]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleGranularityChange = (newGranularity) => {
    setGranularity(newGranularity);
  };

  if (loading) {
    return (
      <div className="card">
        <h2 className="section-title">Analytics</h2>
        <div className="chart-container">
          <div className="text-center text-secondary py-3">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="section-title">Analytics</h2>
        <div className="chart-container">
          <div className="text-center text-secondary py-3">Error loading analytics: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="section-title">Analytics</h2>

      <div className="granularity-tabs" role="tablist" aria-label="Chart granularity">
        {['day', 'week', 'month'].map((g) => (
          <button
            key={g}
            role="tab"
            aria-selected={granularity === g}
            className={`granularity-tab ${granularity === g ? 'active' : ''}`}
            onClick={() => handleGranularityChange(g)}
          >
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </button>
        ))}
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="label"
              stroke="var(--text-secondary)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              stroke="var(--text-secondary)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={(v) => Math.round(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
              formatter={(value) => [Math.round(value), 'Points Earned']}
            />
            <Line
              type="monotone"
              dataKey="earned"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={{ fill: 'var(--accent)', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: 'var(--accent)' }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}