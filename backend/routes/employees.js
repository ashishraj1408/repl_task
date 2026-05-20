const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Add Employee
router.post('/', employeeController.addEmployee);

// Get All Employees (with optional filtering and search)
router.get('/', employeeController.getEmployees);

// Get Average Age by Department
router.get('/average-age/by-department', employeeController.getAverageAgeByDepartment);

// Get All Departments
router.get('/departments/list', employeeController.getDepartments);

// Get Employee by ID
router.get('/:id', employeeController.getEmployeeById);

// Update Employee
router.put('/:id', employeeController.updateEmployee);

// Delete Employee
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
