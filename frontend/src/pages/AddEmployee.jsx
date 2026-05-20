import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEmployee, getDepartments } from '../api/employeeService';

export default function AddEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    department: '',
  });
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data || []);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  // Validation functions
  const validateName = (name) => {
    if (!name || name.trim().length === 0) {
      return 'Name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (name.trim().length > 100) {
      return 'Name cannot exceed 100 characters';
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return '';
  };

  const validateDOB = (dob) => {
    if (!dob) {
      return 'Date of Birth is required';
    }

    const dobDate = new Date(dob);
    const today = new Date();

    if (dobDate > today) {
      return 'Date of Birth cannot be in the future';
    }

    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      const actualAge = age - 1;
      if (actualAge < 18) {
        return 'Employee must be at least 18 years old';
      }
      if (actualAge > 100) {
        return 'Please enter a valid age (maximum 100 years)';
      }
    } else {
      if (age < 18) {
        return 'Employee must be at least 18 years old';
      }
      if (age > 100) {
        return 'Please enter a valid age (maximum 100 years)';
      }
    }

    return '';
  };

  const validateDepartment = (dept) => {
    if (!dept || dept.trim().length === 0) {
      return 'Department is required';
    }
    return '';
  };

  // Real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field as user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const dobError = validateDOB(formData.dateOfBirth);
    if (dobError) newErrors.dateOfBirth = dobError;

    const deptError = validateDepartment(formData.department);
    if (deptError) newErrors.department = deptError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await addEmployee({
        name: formData.name.trim(),
        dateOfBirth: formData.dateOfBirth,
        department: formData.department,
      });

      if (response.success || response.message) {
        setMessageType('success');
        setMessage(response.message || 'Employee added successfully');
        setFormData({
          name: '',
          dateOfBirth: '',
          department: '',
        });
        setErrors({});
        setTimeout(() => {
          navigate('/employees');
        }, 1500);
      }
    } catch (err) {
      setMessageType('error');
      if (err.errors && Array.isArray(err.errors)) {
        setMessage(err.errors.join(', '));
      } else {
        setMessage(err.message || 'Failed to add employee');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Add Employee</h1>

      {message && (
        <div
          style={{
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '4px',
            backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
            color: messageType === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            color: '#333',
          }}>
            Name: <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., John Doe"
            style={{
              width: '100%',
              padding: '10px',
              border: errors.name ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif',
            }}
          />
          {errors.name && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {errors.name}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            color: '#333',
          }}>
            Date of Birth: <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: errors.dateOfBirth ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif',
            }}
          />
          {errors.dateOfBirth && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            color: '#333',
          }}>
            Department: <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: errors.department ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {errors.department}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            width: '100%',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.backgroundColor = '#218838';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.backgroundColor = '#28a745';
          }}
        >
          {loading ? 'Adding...' : 'Add Employee'}
        </button>
      </form>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666',
      }}>
        <strong>Validation Rules:</strong>
        <ul style={{ marginTop: '8px', marginBottom: 0 }}>
          <li>Name: 2-100 characters, letters only (no numbers)</li>
          <li>Age: Between 18-100 years old</li>
          <li>Department: Select from dropdown list</li>
        </ul>
      </div>
    </div>
  );
}
