import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getEmployees, deleteEmployee, getDepartments } from '../api/employeeService';
import AverageAgeByDepartment from '../components/AverageAgeByDepartment';

const VALID_DEPARTMENTS = ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations', 'Management'];

const getPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
};

const readFiltersFromSearchParams = (searchParams) => {
  const department = searchParams.get('department') || '';
  const search = searchParams.get('search') || '';

  return {
    department: VALID_DEPARTMENTS.includes(department) ? department : '',
    search: search.length <= 100 ? search : search.slice(0, 100),
  };
};

const readMetaFromSearchParams = (searchParams) => ({
  page: getPositiveInt(searchParams.get('page'), 1),
  limit: getPositiveInt(searchParams.get('limit'), 10),
  totalPages: 1,
  totalCount: 0,
});

export default function EmployeeList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(() => readFiltersFromSearchParams(searchParams));
  const [meta, setMeta] = useState(() => readMetaFromSearchParams(searchParams));
  const [showAverageAge, setShowAverageAge] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteMessageType, setDeleteMessageType] = useState('');

  const requestIdRef = useRef(0);
  const hasActiveFilters = Boolean(filters.department || filters.search);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const timeoutId = setTimeout(() => {
      fetchEmployees(requestId);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [filters.department, filters.search, meta.page, meta.limit]);

  const fetchEmployees = async (requestId) => {
    try {
      setLoading(true);
      const response = await getEmployees({
        department: filters.department,
        search: filters.search,
        page: meta.page,
        limit: meta.limit,
      });

      if (requestId !== requestIdRef.current) return;

      if (response && response.success) {
        setEmployees(response.data || []);
        setMeta((m) => ({
          ...m,
          page: response.meta?.page || m.page,
          limit: response.meta?.limit || m.limit,
          totalPages: response.meta?.totalPages || m.totalPages,
          totalCount: response.meta?.totalCount || m.totalCount,
        }));
        setError('');
      } else {
        setEmployees(response.data || []);
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err.message || 'Failed to fetch employees');
      setEmployees([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data || []);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const validateSearch = (value) => {
    if (typeof value !== 'string') return false;
    if (value.trim().length > 100) return false;
    return true;
  };

  const updateURLParams = (newFilters, newMeta) => {
    const params = {};
    if (newFilters.department) params.department = newFilters.department;
    if (newFilters.search) params.search = newFilters.search;
    if (newMeta.page) params.page = newMeta.page;
    if (newMeta.limit) params.limit = newMeta.limit;
    setSearchParams(params, { replace: true });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === 'search' && !validateSearch(value)) {
      return;
    }
    if (name === 'department' && value && !VALID_DEPARTMENTS.includes(value)) {
      return;
    }

    const updatedFilters = { ...filters, [name]: value };
    const newMeta = { ...meta, page: 1 };
    setFilters(updatedFilters);
    setMeta(newMeta);
    updateURLParams(updatedFilters, newMeta);
  };

  const handleDelete = async (id, employeeName) => {
    if (window.confirm(`Are you sure you want to delete ${employeeName}? This action cannot be undone.`)) {
      try {
        await deleteEmployee(id);
        setDeleteMessage(`${employeeName} has been deleted successfully`);
        setDeleteMessageType('success');
        requestIdRef.current += 1;
        fetchEmployees(requestIdRef.current);
        setTimeout(() => {
          setDeleteMessage('');
        }, 3000);
      } catch (err) {
        setDeleteMessage(err.message || 'Failed to delete employee');
        setDeleteMessageType('error');
        setTimeout(() => {
          setDeleteMessage('');
        }, 3000);
      }
    }
  };

  const handleResetFilters = () => {
    const newFilters = { department: '', search: '' };
    const newMeta = { ...meta, page: 1 };
    setFilters(newFilters);
    setMeta(newMeta);
    updateURLParams(newFilters, newMeta);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Employee List</h1>

      {error && (
        <div
          style={{
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '4px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
          }}
        >
          Error: {error}
        </div>
      )}

      {deleteMessage && (
        <div
          style={{
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '4px',
            backgroundColor: deleteMessageType === 'success' ? '#d4edda' : '#f8d7da',
            color: deleteMessageType === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${deleteMessageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          }}
        >
          {deleteMessage}
        </div>
      )}

      <div
        style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          border: '1px solid #e0e0e0',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>Filters & Search</h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '12px',
          marginBottom: '12px',
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#333',
              fontSize: '14px',
            }}>
              Department:
            </label>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: 'bold',
              color: '#333',
              fontSize: '14px',
            }}>
              Search by Name:
            </label>
            <input
              type="text"
              name="search"
              placeholder="Type employee name..."
              value={filters.search}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleResetFilters}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            Reset Filters
          </button>

          <button
            onClick={() => setShowAverageAge(!showAverageAge)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#138496'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#17a2b8'}
          >
            {showAverageAge ? 'Hide' : 'Show'} Average Age Statistics
          </button>
        </div>
      </div>

      {showAverageAge && <AverageAgeByDepartment />}

      {hasActiveFilters && (
        <div style={{
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#e7f3ff',
          borderRadius: '4px',
          border: '1px solid #b3d9ff',
          color: '#004085',
          fontSize: '14px',
        }}>
          {filters.department && <span>Filter: {filters.department}</span>}
          {filters.department && filters.search && <span> | </span>}
          {filters.search && <span>Search: "{filters.search}"</span>}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          Loading employees...
        </div>
      ) : employees.length === 0 ? (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            color: '#666',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        >
          No employees found
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{
                backgroundColor: '#f5f5f5',
                borderBottom: '2px solid #ddd',
              }}>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#333',
                  borderRight: '1px solid #ddd',
                }}>
                  Name
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#333',
                  borderRight: '1px solid #ddd',
                }}>
                  Date of Birth
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#333',
                  borderRight: '1px solid #ddd',
                }}>
                  Age
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  color: '#333',
                  borderRight: '1px solid #ddd',
                }}>
                  Department
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: '#333',
                }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => {
                const dob = new Date(employee.dateOfBirth);
                const today = new Date();
                let age = today.getFullYear() - dob.getFullYear();
                const monthDiff = today.getMonth() - dob.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                  age--;
                }

                return (
                  <tr
                    key={employee._id}
                    style={{
                      borderBottom: '1px solid #ddd',
                      backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                    }}
                  >
                    <td style={{
                      padding: '12px',
                      borderRight: '1px solid #ddd',
                      color: '#333',
                    }}>
                      {employee.name}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderRight: '1px solid #ddd',
                      color: '#666',
                    }}>
                      {new Date(employee.dateOfBirth).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderRight: '1px solid #ddd',
                      color: '#666',
                      fontWeight: '500',
                    }}>
                      {age} years
                    </td>
                    <td style={{
                      padding: '12px',
                      borderRight: '1px solid #ddd',
                      color: '#666',
                    }}>
                      <span
                        style={{
                          backgroundColor: '#e7f3ff',
                          color: '#004085',
                          padding: '4px 8px',
                          borderRadius: '3px',
                          fontSize: '13px',
                        }}
                      >
                        {employee.department}
                      </span>
                    </td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'center',
                    }}>
                      <button
                        onClick={() => handleDelete(employee._id, employee.name)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
        <button
          onClick={() => {
            if (meta.page > 1) {
              const newMeta = { ...meta, page: meta.page - 1 };
              setMeta(newMeta);
              updateURLParams(filters, newMeta);
            }
          }}
          disabled={meta.page <= 1}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: meta.page <= 1 ? '#f1f1f1' : 'white', cursor: meta.page <= 1 ? 'not-allowed' : 'pointer' }}
        >
          Prev
        </button>

        <span style={{ color: '#333' }}>Page {meta.page} of {meta.totalPages}</span>

        <button
          onClick={() => {
            if (meta.page < meta.totalPages) {
              const newMeta = { ...meta, page: meta.page + 1 };
              setMeta(newMeta);
              updateURLParams(filters, newMeta);
            }
          }}
          disabled={meta.page >= meta.totalPages}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: meta.page >= meta.totalPages ? '#f1f1f1' : 'white', cursor: meta.page >= meta.totalPages ? 'not-allowed' : 'pointer' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
