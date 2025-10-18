const Post = require('../models/Post');
const { mockPosts } = require('../data/mockData');
const { deleteMultipleFiles, getFilesToDelete } = require('../utils/fileUtils');

/**
 * Post Controller
 * Xử lý các request liên quan đến quản lý posts
 */

/**
 * Lấy tất cả posts với phân trang và filter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllPosts = async (req, res) => {
  try {
    const { page, limit, category, status = 'published', search } = req.query;
    
    // Nếu không phải admin, chỉ cho xem published posts
    const filterStatus = req.user && req.user.role === 'admin' ? status : 'published';
    
    const result = await Post.findAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      category,
      status: filterStatus,
      search
    });

    res.json({
      success: true,
      message: 'Posts retrieved successfully',
      data: {
        posts: result.posts,
        pagination: result.pagination
      }
    });

  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve posts',
      code: 'GET_POSTS_ERROR'
    });
  }
};

/**
 * Lấy post theo ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    // Nếu không phải admin và post không published, trả về 404
    if (post.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    // Tăng view count nếu là published post
    if (post.status === 'published') {
      await Post.incrementViewCount(id);
    }

    res.json({
      success: true,
      message: 'Post retrieved successfully',
      data: {
        post
      }
    });

  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve post',
      code: 'GET_POST_ERROR'
    });
  }
};

/**
 * Tạo post mới (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createPost = async (req, res) => {
  try {
    const { title, content, category, thumbnail_url, pdf_url, status = 'draft' } = req.body;
    const author_id = req.user.id;

    const post = await Post.create({
      title,
      content,
      category,
      thumbnail_url,
      pdf_url,
      author_id,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        post
      }
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      code: 'CREATE_POST_ERROR'
    });
  }
};

/**
 * Cập nhật post (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    const updatedPost = await Post.update(id, updateData);
    
    if (!updatedPost) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update post',
        code: 'UPDATE_POST_ERROR'
      });
    }

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: {
        post: updatedPost
      }
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update post',
      code: 'UPDATE_POST_ERROR'
    });
  }
};

/**
 * Xóa post (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    // Lấy danh sách file cần xóa trước khi xóa post
    const filesToDelete = getFilesToDelete(post);
    
    const success = await Post.delete(id);
    
    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete post',
        code: 'DELETE_POST_ERROR'
      });
    }

    // Xóa các file liên quan sau khi xóa post thành công
    if (filesToDelete.length > 0) {
      await deleteMultipleFiles(filesToDelete);
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      code: 'DELETE_POST_ERROR'
    });
  }
};

/**
 * Lấy posts phổ biến
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPopularPosts = async (req, res) => {
  try {
    const { limit: rawLimit } = req.query;
    const limit = Number.parseInt(rawLimit, 10);
    const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 5;
    
    const posts = await Post.getPopular(safeLimit);

    res.json({
      success: true,
      message: 'Popular posts retrieved successfully',
      data: {
        posts
      }
    });

  } catch (error) {
    console.error('Get popular posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve popular posts',
      code: 'GET_POPULAR_POSTS_ERROR'
    });
  }
};

/**
 * Lấy posts mới nhất
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLatestPosts = async (req, res) => {
  try {
    const { limit: rawLimit } = req.query;
    const limit = Number.parseInt(rawLimit, 10);
    const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 5;
    
    const posts = await Post.getLatest(safeLimit);

    res.json({
      success: true,
      message: 'Latest posts retrieved successfully',
      data: {
        posts
      }
    });

  } catch (error) {
    console.error('Get latest posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve latest posts',
      code: 'GET_LATEST_POSTS_ERROR'
    });
  }
};

/**
 * Tăng lượt xem post
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const incrementViewCount = async (req, res) => {
  try {
    const { id } = req.params;
    
    const success = await Post.incrementViewCount(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'View count incremented successfully'
    });

  } catch (error) {
    console.error('Increment view count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to increment view count',
      code: 'INCREMENT_VIEW_ERROR'
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPopularPosts,
  getLatestPosts,
  incrementViewCount
};
