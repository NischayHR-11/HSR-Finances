import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Borrowers from './Borrowers';
import Notifications from './Notifications';
import Settings from './Settings';
import './Layout.css';

const Layout = ({ onLogout }) => {
  const location = useLocation();

  return (
    <div className="layout">
      <Sidebar currentPath={location.pathname} onLogout={onLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/borrowers" element={<Borrowers />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default Layout;
