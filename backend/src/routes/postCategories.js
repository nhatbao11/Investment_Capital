const express = require('express');
const router = express.Router();
const { 
  getAllPostCategories, 
  getPostCategoriesByType,
  createPostCategory, 
  updatePostCategory, 
  deletePostCategory 
} = require('../controllers/postCategoryController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/', getAllPostCategories);
router.get('/type/:type', getPostCategoriesByType);

// Protected routes (admin only)
router.post('/', authenticate, createPostCategory);
router.put('/:id', authenticate, updatePostCategory);
router.delete('/:id', authenticate, deletePostCategory);

module.exports = router;
