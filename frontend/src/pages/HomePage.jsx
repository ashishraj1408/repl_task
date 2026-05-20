import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}>
        <h1 style={{
          color: '#2c3e50',
          fontSize: '32px',
          marginBottom: '10px',
        }}>
          Homepage
        </h1>
        
        <p style={{
          color: '#666',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '20px',
        }}>
          Welcome to the Employee Management System. This application helps you manage employee
          information, including their personal details and department assignments.
        </p>

        <p style={{
          color: '#888',
          fontSize: '14px',
          marginBottom: '30px',
        }}>
          Get started by managing your employee database.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px',
          marginTop: '30px',
        }}>
          <Link
            to="/employees"
            style={{
              padding: '12px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease',
              display: 'block',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
          >
            View Employees
          </Link>
          
          <Link
            to="/add-employee"
            style={{
              padding: '12px 20px',
              backgroundColor: '#27ae60',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease',
              display: 'block',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#229954'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
          >
            Add Employee
          </Link>
        </div>
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#ecf0f1',
        borderRadius: '8px',
      }}>
        <h3 style={{
          color: '#2c3e50',
          marginTop: 0,
        }}>
          Features
        </h3>
        <ul style={{
          color: '#555',
          lineHeight: '1.8',
          marginBottom: 0,
        }}>
          <li>Add and manage employee information</li>
          <li>Filter employees by department</li>
          <li>Search employees by name</li>
          <li>View average age statistics by department</li>
          <li>Delete employee records</li>
        </ul>
      </div>
    </div>
  );
}
