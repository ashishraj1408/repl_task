const Employee = require('../models/Employee');

const validDepartments = ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations', 'Management'];
const allowedSortFields = ['name', 'dateOfBirth', 'department', 'createdAt', 'updatedAt'];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildDepartmentFilter = (department) => {
  if (department === 'Engineering') {
    return { $regex: '(engineering|engineer|enigneer)', $options: 'i' };
  }

  return {
    $regex: `^${escapeRegex(department)}$`,
    $options: 'i',
  };
};

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validateName = (name) => {
  if (!name || typeof name !== 'string') return false;
  if (name.trim().length < 2 || name.trim().length > 100) return false;
  return /^[a-zA-Z\s'-]+$/.test(name);
};

const validateDepartment = (department) => {
  return validDepartments.includes(department);
};

const validateDOB = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return { valid: false, message: 'Invalid date format' };
  
  if (dob > new Date()) {
    return { valid: false, message: 'Date of birth cannot be in the future' };
  }
  
  const age = new Date().getFullYear() - dob.getFullYear();
  if (age < 18) {
    return { valid: false, message: 'Employee must be at least 18 years old' };
  }
  if (age > 100) {
    return { valid: false, message: 'Please enter a valid age (maximum 100 years)' };
  }
  
  return { valid: true };
};

// Add Employee
exports.addEmployee = async (req, res) => {
  try {
    const { name, dateOfBirth, department, email } = req.body;

    // Validation
    const errors = [];

    if (!name) {
      errors.push('Name is required');
    } else if (!validateName(name)) {
      errors.push('Name must be 2-100 characters and contain only letters, spaces, hyphens, and apostrophes');
    }

    if (!dateOfBirth) {
      errors.push('Date of Birth is required');
    } else {
      const dobValidation = validateDOB(dateOfBirth);
      if (!dobValidation.valid) {
        errors.push(dobValidation.message);
      }
    }

    if (!department) {
      errors.push('Department is required');
    } else if (!validateDepartment(department)) {
      errors.push('Invalid department. Valid options: Engineering, HR, Sales, Marketing, Finance, Operations, Management');
    }

    if (email && !validateEmail(email)) {
      errors.push('Invalid email format');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const employee = new Employee({
      name: name.trim(),
      dateOfBirth,
      department,
      email: email ? email.toLowerCase().trim() : undefined,
    });

    const savedEmployee = await employee.save();
    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: savedEmployee,
    });
  } catch (error) {
    const errorMessage = error.message || 'Failed to add employee';
    res.status(500).json({
      success: false,
      message: 'Error adding employee',
      error: errorMessage,
    });
  }
};

// Get All Employees with optional filtering, search and pagination
exports.getEmployees = async (req, res) => {
  try {
    const { department, search, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(Math.min(parseInt(limit, 10) || 10, 100), 1);
    const normalizedDepartment = typeof department === 'string' ? department.trim() : '';
    const normalizedSearch = typeof search === 'string' ? search.trim() : '';

    let filter = {};

    if (normalizedDepartment) {
      if (!validateDepartment(normalizedDepartment)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid department filter',
        });
      }
      filter.department = buildDepartmentFilter(normalizedDepartment);
    }

    if (search !== undefined) {
      if (typeof search !== 'string' || normalizedSearch.length === 0 || normalizedSearch.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Search term must be a non-empty string up to 100 characters',
        });
      }
      filter.name = { $regex: escapeRegex(normalizedSearch), $options: 'i' };
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortObj = {};
    sortObj[safeSortBy] = sortOrder;

    const totalCount = await Employee.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNum) || 1;

    const employees = await Employee.find(filter)
      .sort(sortObj)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully',
      meta: {
        totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving employees',
      error: error.message,
    });
  }
};

// Get Employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format',
      });
    }

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully',
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving employee',
      error: error.message,
    });
  }
};

// Update Employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dateOfBirth, department, email } = req.body;

    // Validate MongoDB ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format',
      });
    }

    // Validation
    const errors = [];

    if (name !== undefined && !validateName(name)) {
      errors.push('Name must be 2-100 characters and contain only letters, spaces, hyphens, and apostrophes');
    }

    if (dateOfBirth !== undefined) {
      const dobValidation = validateDOB(dateOfBirth);
      if (!dobValidation.valid) {
        errors.push(dobValidation.message);
      }
    }

    if (department !== undefined && !validateDepartment(department)) {
      errors.push('Invalid department. Valid options: Engineering, HR, Sales, Marketing, Finance, Operations, Management');
    }

    if (email !== undefined && email && !validateEmail(email)) {
      errors.push('Invalid email format');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const updateData = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name.trim();
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (department !== undefined) updateData.department = department;
    if (email !== undefined) updateData.email = email ? email.toLowerCase().trim() : undefined;

    const employee = await Employee.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating employee',
      error: error.message,
    });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format',
      });
    }

    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting employee',
      error: error.message,
    });
  }
};

// Get Average Age by Department
exports.getAverageAgeByDepartment = async (req, res) => {
  try {
    const result = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          averageAge: {
            $avg: {
              $divide: [
                { $subtract: [new Date(), '$dateOfBirth'] },
                31536000000, // milliseconds in a year
              ],
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      message: 'Average age by department retrieved successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving average age data',
      error: error.message,
    });
  }
};

// Get All Departments
exports.getDepartments = async (req, res) => {
  try {
    if (req.query.activeOnly === 'true') {
      const departments = await Employee.distinct('department', {
        department: { $in: validDepartments },
      });

      return res.status(200).json({
        success: true,
        message: 'Active departments retrieved successfully',
        data: validDepartments.filter((department) => departments.includes(department)),
      });
    }

    res.status(200).json({
      success: true,
      message: 'Departments retrieved successfully',
      data: validDepartments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving departments',
      error: error.message,
    });
  }
};
