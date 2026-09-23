import ScorecardSummary from '../components/ScorecardSummary';
import AnalyticsChart from '../components/AnalyticsChart';

export default function Dashboard() {
  return (
    <div>
      <header>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Monitor progress and manage tasks</p>
      </header>

      <div style={{ display: 'grid', gap: '2rem', marginBottom: '2rem' }}>
        <ScorecardSummary />
        <AnalyticsChart />
      </div>
    </div>
  );
}