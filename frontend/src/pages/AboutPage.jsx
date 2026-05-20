import React from 'react';

export default function AboutPage() {
  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{
          color: '#2c3e50',
          marginTop: 0,
          marginBottom: '20px',
        }}>
          About
        </h1>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{
            color: '#34495e',
            fontSize: '20px',
            marginTop: 0,
          }}>
            About This Application
          </h2>
          <p style={{
            color: '#555',
            lineHeight: '1.8',
            fontSize: '15px',
          }}>
            The Employee Management System is a modern web application designed to simplify
            employee data management. Built with the latest technologies, it provides a clean
            and intuitive interface for managing employee information across departments.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{
            color: '#34495e',
            fontSize: '20px',
            marginTop: 0,
          }}>
            Technology Stack
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
          }}>
            <div style={{
              backgroundColor: '#f0f8ff',
              padding: '15px',
              borderRadius: '4px',
              borderLeft: '4px solid #3498db',
            }}>
              <h3 style={{
                color: '#2c3e50',
                fontSize: '14px',
                margin: '0 0 8px 0',
              }}>
                Frontend
              </h3>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '13px',
                color: '#555',
              }}>
                <li>React 18</li>
                <li>Vite</li>
                <li>React Router</li>
                <li>Axios</li>
              </ul>
            </div>

            <div style={{
              backgroundColor: '#f0fff4',
              padding: '15px',
              borderRadius: '4px',
              borderLeft: '4px solid #27ae60',
            }}>
              <h3 style={{
                color: '#2c3e50',
                fontSize: '14px',
                margin: '0 0 8px 0',
              }}>
                Backend
              </h3>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '13px',
                color: '#555',
              }}>
                <li>Node.js</li>
                <li>Express</li>
                <li>MongoDB</li>
                <li>Mongoose</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{
            color: '#34495e',
            fontSize: '20px',
            marginTop: 0,
          }}>
            Key Features
          </h2>
          <ul style={{
            color: '#555',
            lineHeight: '1.8',
            fontSize: '14px',
          }}>
            <li>✓ Comprehensive employee management</li>
            <li>✓ Advanced filtering and search capabilities</li>
            <li>✓ Department-based analytics</li>
            <li>✓ Form validation on frontend and backend</li>
            <li>✓ Real-time UI updates</li>
            <li>✓ Clean and professional interface</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
