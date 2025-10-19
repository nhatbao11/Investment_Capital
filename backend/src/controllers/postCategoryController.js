const PostCategory = require('../models/PostCategory');

/**
 * Lấy tất cả post categories
 */
const getAllPostCategories = async (req, res) => {
  try {
    const categories = await PostCategory.getWithCounts();
    
    res.json({
      success: true,
      message: 'Post categories retrieved successfully',
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get all post categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve post categories',
      code: 'GET_POST_CATEGORIES_ERROR'
    });
  }
};

/**
 * Lấy post categories theo type
 */
const getPostCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['nganh', 'doanh_nghiep'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category type',
        code: 'INVALID_CATEGORY_TYPE'
      });
    }
    
    const categories = await PostCategory.getWithCountsByType(type);
    
    res.json({
      success: true,
      message: 'Post categories retrieved successfully',
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get post categories by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve post categories',
      code: 'GET_POST_CATEGORIES_BY_TYPE_ERROR'
    });
  }
};

/**
 * Tạo post category mới
 */
const createPostCategory = async (req, res) => {
  try {
    const { name, description, color, category_type } = req.body;
    
    // Validate required fields
    if (!name || !category_type) {
      return res.status(400).json({
        success: false,
        message: 'Tên danh mục và loại danh mục là bắt buộc',
        code: 'NAME_AND_TYPE_REQUIRED'
      });
    }
    
    if (!['nganh', 'doanh_nghiep'].includes(category_type)) {
      return res.status(400).json({
        success: false,
        message: 'Loại danh mục không hợp lệ',
        code: 'INVALID_CATEGORY_TYPE'
      });
    }
    
    // Check if category already exists
    const existingCategory = await PostCategory.findByName(name, category_type);
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Danh mục đã tồn tại trong loại này',
        code: 'CATEGORY_EXISTS'
      });
    }
    
    const category = await PostCategory.create({
      name,
      description,
      color,
      category_type
    });
    
    res.status(201).json({
      success: true,
      message: 'Post category created successfully',
      data: {
        category
      }
    });
  } catch (error) {
    console.error('Create post category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post category',
      code: 'CREATE_POST_CATEGORY_ERROR'
    });
  }
};

/**
 * Cập nhật post category
 */
const updatePostCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const category = await PostCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Post category not found',
        code: 'POST_CATEGORY_NOT_FOUND'
      });
    }
    
    // Check if new name already exists (if name is being updated)
    if (updateData.name && updateData.name !== category.name) {
      const existingCategory = await PostCategory.findByName(updateData.name, category.category_type);
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Tên danh mục đã tồn tại trong loại này',
          code: 'CATEGORY_NAME_EXISTS'
        });
      }
    }
    
    const updatedCategory = await PostCategory.update(id, updateData);
    
    res.json({
      success: true,
      message: 'Post category updated successfully',
      data: {
        category: updatedCategory
      }
    });
  } catch (error) {
    console.error('Update post category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post category',
      code: 'UPDATE_POST_CATEGORY_ERROR'
    });
  }
};

/**
 * Xóa post category
 */
const deletePostCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await PostCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Post category not found',
        code: 'POST_CATEGORY_NOT_FOUND'
      });
    }
    
    // Check if category has posts
    const categoriesWithCounts = await PostCategory.getWithCountsByType(category.category_type);
    const categoryWithCount = categoriesWithCounts.find(c => c.id == id);
    
    if (categoryWithCount && categoryWithCount.post_count > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa danh mục vì còn ${categoryWithCount.post_count} bài viết`,
        code: 'CATEGORY_HAS_POSTS'
      });
    }
    
    await PostCategory.delete(id);
    
    res.json({
      success: true,
      message: 'Post category deleted successfully'
    });
  } catch (error) {
    console.error('Delete post category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post category',
      code: 'DELETE_POST_CATEGORY_ERROR'
    });
  }
};

module.exports = {
  getAllPostCategories,
  getPostCategoriesByType,
  createPostCategory,
  updatePostCategory,
  deletePostCategory
};
