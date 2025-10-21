const Category = require('../models/Category');

/**
 * Lấy tất cả categories
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getWithCounts();
    
    res.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      code: 'GET_CATEGORIES_ERROR'
    });
  }
};

/**
 * Tạo category mới
 */
const createCategory = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Tên danh mục là bắt buộc',
        code: 'NAME_REQUIRED'
      });
    }
    
    // Check if category already exists
    const existingCategory = await Category.findByName(name);
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Danh mục đã tồn tại',
        code: 'CATEGORY_EXISTS'
      });
    }
    
    const category = await Category.create({
      name,
      description,
      color
    });
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        category
      }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      code: 'CREATE_CATEGORY_ERROR'
    });
  }
};

/**
 * Cập nhật category
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }
    
    // Check if new name already exists (if name is being updated)
    if (updateData.name && updateData.name !== category.name) {
      const existingCategory = await Category.findByName(updateData.name);
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Tên danh mục đã tồn tại',
          code: 'CATEGORY_NAME_EXISTS'
        });
      }
    }
    
    const updatedCategory = await Category.update(id, updateData);
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: {
        category: updatedCategory
      }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      code: 'UPDATE_CATEGORY_ERROR'
    });
  }
};

/**
 * Xóa category
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Delete category request for ID:', id);
    
    const category = await Category.findById(id);
    if (!category) {
      console.log('Category not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Category not found',
        code: 'CATEGORY_NOT_FOUND'
      });
    }
    
    console.log('Category found, attempting deletion:', category);
    await Category.delete(id);
    console.log('Category deleted successfully:', id);
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete category',
      code: 'DELETE_CATEGORY_ERROR'
    });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};



















