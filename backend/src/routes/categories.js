const express = require('express');
const router = express.Router();
const { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/', getAllCategories);

// Protected routes (admin only)
router.post('/', authenticate, createCategory);
router.put('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);

module.exports = router;

