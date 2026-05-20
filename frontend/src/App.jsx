import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';

function App() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname === path;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        backgroundColor: '#2c3e50',
        padding: '0',
        position: 'sticky',
        top: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
        }}>
          <Link
            to="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '18px',
              marginRight: '40px',
              padding: '15px 0',
              borderBottom: '3px solid transparent',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.color = '#3498db'}
            onMouseLeave={(e) => e.target.style.color = 'white'}
          >
            EMS
          </Link>

          <div style={{ display: 'flex', gap: '0' }}>
            {[
              { path: '/homepage', label: 'Homepage' },
              { path: '/about', label: 'About' },
              { path: '/employees', label: 'Employee List' },
              { path: '/add-employee', label: 'Add Employee' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '15px 15px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderBottom: isActive(link.path) ? '3px solid #3498db' : '3px solid transparent',
                  transition: 'all 0.3s ease',
                  backgroundColor: isActive(link.path) ? 'rgba(52, 152, 219, 0.1)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
                  if (!isActive(link.path)) e.target.style.borderBottomColor = '#3498db';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = isActive(link.path) ? 'rgba(52, 152, 219, 0.1)' : 'transparent';
                  if (!isActive(link.path)) e.target.style.borderBottomColor = 'transparent';
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main style={{
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '20px',
      }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/add-employee" element={<AddEmployee />} />
        </Routes>
      </main>

      <footer style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        textAlign: 'center',
        padding: '15px',
        marginTop: '40px',
        fontSize: '12px',
      }}>
        <p style={{ margin: 0 }}>© 2026 Employee Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
