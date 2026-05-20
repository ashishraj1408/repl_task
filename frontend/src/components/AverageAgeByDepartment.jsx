import React, { useState, useEffect } from 'react';
import { getAverageAgeByDepartment } from '../api/employeeService';

export default function AverageAgeByDepartment() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAverageAge();
  }, []);

  const fetchAverageAge = async () => {
    try {
      setLoading(true);
      const response = await getAverageAgeByDepartment();
      
      // Validate response data
      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData([]);
      }
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch average age data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
        color: '#666',
      }}>
        Loading statistics...
      </div>
    );
  }

  return (
    <div style={{
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#f0f8ff',
      borderRadius: '4px',
      border: '1px solid #b3d9ff',
    }}>
      <h2 style={{
        marginTop: 0,
        marginBottom: '15px',
        color: '#333',
        fontSize: '18px',
      }}>
        Average Age by Department
      </h2>

      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '15px',
          borderRadius: '4px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
        }}>
          Error: {error}
        </div>
      )}

      {data.length === 0 ? (
        <p style={{ color: '#666', marginBottom: 0 }}>No data available</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            marginTop: '10px',
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#e7f3ff',
                borderBottom: '2px solid #b3d9ff',
              }}>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#004085',
                  borderRight: '1px solid #b3d9ff',
                }}>
                  Department
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#004085',
                  borderRight: '1px solid #b3d9ff',
                }}>
                  Average Age
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#004085',
                }}>
                  Employee Count
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                // Validate data
                const department = item._id || 'Unknown';
                const averageAge = typeof item.averageAge === 'number' ? item.averageAge.toFixed(2) : 'N/A';
                const count = typeof item.count === 'number' ? item.count : 0;

                return (
                  <tr
                    key={index}
                    style={{
                      borderBottom: '1px solid #ddd',
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb',
                    }}
                  >
                    <td style={{
                      padding: '12px',
                      borderRight: '1px solid #ddd',
                      color: '#333',
                      fontWeight: '500',
                    }}>
                      {department}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderRight: '1px solid #ddd',
                      color: '#333',
                      fontWeight: '500',
                    }}>
                      {averageAge} years
                    </td>
                    <td style={{
                      padding: '12px',
                      color: '#666',
                    }}>
                      {count} employee{count !== 1 ? 's' : ''}
                    </td>
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
