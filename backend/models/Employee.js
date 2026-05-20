const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    match: [/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of Birth is required'],
    validate: {
      validator: function(value) {
        const today = new Date();
        const age = today.getFullYear() - value.getFullYear();
        return age >= 18 && age <= 100;
      },
      message: 'Employee must be between 18 and 100 years old',
    },
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Date of Birth cannot be in the future',
    },
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    minlength: [2, 'Department must be at least 2 characters long'],
    maxlength: [50, 'Department cannot exceed 50 characters'],
    enum: {
      values: ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations', 'Management'],
      message: 'Please select a valid department',
    },
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to validate
employeeSchema.pre('save', function(next) {
  if (this.dateOfBirth) {
    const age = new Date().getFullYear() - this.dateOfBirth.getFullYear();
    if (age < 18 || age > 100) {
      throw new Error('Employee age must be between 18 and 100 years');
    }
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
