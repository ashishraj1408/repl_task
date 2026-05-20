import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Add Employee
export const addEmployee = async (employeeData) => {
  try {
    const response = await apiClient.post('/employees', employeeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred' };
  }
};

// Get All Employees
export const getEmployees = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.department) params.append('department', filters.department);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);

    const response = await apiClient.get(`/employees?${params.toString()}`);
    // return both meta and data for pagination
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred' };
  }
};

// Get Employee by ID
export const getEmployeeById = async (id) => {
  try {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred' };
  }
};

// Update Employee
export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await apiClient.put(`/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred' };
  }
};

// Delete Employee
export const deleteEmployee = async (id) => {
  try {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred' };
  }
};

// Get Average Age by Department
export const getAverageAgeByDepartment = async () => {
  try {
    const response = await apiClient.get('/employees/average-age/by-department');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred' };
  }
};

// Get All Departments
export const getDepartments = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    if (options.activeOnly) params.append('activeOnly', 'true');

    const query = params.toString();
    const response = await apiClient.get(`/employees/departments/list${query ? `?${query}` : ''}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'An error occurred' };
  }
};
