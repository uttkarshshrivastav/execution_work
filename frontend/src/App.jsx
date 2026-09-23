import { Routes, Route, Link, useLocation } from 'react-router-dom';
import DayView from './pages/DayView';
import Dashboard from './pages/Dashboard';

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`nav-link ${isActive ? 'active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

function NavBar() {
  return (
    <nav className="nav-bar" role="navigation" aria-label="Main navigation">
      <h1 className="app-title nav-title">Tracker</h1>
      <div className="nav-links">
        <NavLink to="/">Day View</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </div>
    </nav>
  );
}

function App() {
  return (
    <>
      <NavBar />
      <main className="app-layout" role="main">
        <Routes>
          <Route path="/" element={<DayView />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </>
  );
}

export default App;