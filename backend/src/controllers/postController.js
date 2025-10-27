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
    const { page, limit, category, category_id, status, search } = req.query;
    
    // Nếu không phải admin, chỉ cho xem published posts
    let filterStatus;
    if (req.user && req.user.role === 'admin') {
      filterStatus = (status === 'all' || status === undefined) ? null : status;
    } else {
      filterStatus = 'published';
    }
    
    const result = await Post.findAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      category,
      category_id: category_id ? parseInt(category_id) : undefined,
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
    const { title, content, category, category_id, thumbnail_url, pdf_url, status = 'draft', send_newsletter } = req.body;
    const author_id = req.user.id;
    
    console.log('Create post request body:', req.body);
    console.log('Category:', category, 'Category ID:', category_id);

    let finalPdfUrl = pdf_url;
    let finalThumbnailUrl = thumbnail_url;
    let finalCategoryId = category_id;

    // Handle uploaded PDF file
    if (req.files && req.files.pdf && req.files.pdf.length > 0) {
      finalPdfUrl = `/uploads/posts/${req.files.pdf[0].filename}`;
    }

    // Handle uploaded thumbnail file
    if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
      finalThumbnailUrl = `/uploads/posts/${req.files.thumbnail[0].filename}`;
    }

    // Handle category_id: convert to null if empty/undefined
    if (finalCategoryId === undefined || finalCategoryId === '' || finalCategoryId === null) {
      finalCategoryId = null;
    } else {
      finalCategoryId = parseInt(finalCategoryId);
    }

    const post = await Post.create({
      title,
      content,
      category,
      category_id: finalCategoryId,
      thumbnail_url: finalThumbnailUrl,
      pdf_url: finalPdfUrl,
      author_id,
      status
    });

    // CHỨC NĂNG TỰ ĐỘNG GỬI EMAIL ĐÃ BỊ TẮT
    // Admin phải dùng nút "Gửi email" trong UI để gửi thủ công

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        post
      }
    });
    
    // Invalidate cache sau khi tạo post mới
    // invalidateCache('posts');
    // invalidateCache('GET:/api/v1/posts');

  } catch (error) {
    console.error('Create post error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      code: 'CREATE_POST_ERROR',
      details: error.message
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

    // Handle uploaded PDF file (takes priority)
    if (req.files && req.files.pdf && req.files.pdf.length > 0) {
      updateData.pdf_url = `/uploads/posts/${req.files.pdf[0].filename}`;
    }

    // Handle uploaded thumbnail file (takes priority)
    if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
      updateData.thumbnail_url = `/uploads/posts/${req.files.thumbnail[0].filename}`;
    }

    // Handle category_id: convert to null if empty/undefined
    if (updateData.category_id === undefined || updateData.category_id === '' || updateData.category_id === null) {
      updateData.category_id = null;
    } else {
      updateData.category_id = parseInt(updateData.category_id);
    }

    const updatedPost = await Post.update(id, updateData);
    
    if (!updatedPost) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update post',
        code: 'UPDATE_POST_ERROR'
      });
    }

    // CHỨC NĂNG TỰ ĐỘNG GỬI EMAIL ĐÃ BỊ TẮT
    // Admin phải dùng nút "Gửi email" trong UI để gửi thủ công

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
    const user_id = req.user?.id || null;
    // Lấy IP từ X-Forwarded-For header (từ Next.js API) hoặc từ req.ip
    let ip_address = req.get('X-Forwarded-For') || req.ip;
    // Nếu X-Forwarded-For có nhiều IP (trong trường hợp proxy chain), lấy IP đầu tiên
    if (ip_address && ip_address.includes(',')) {
      ip_address = ip_address.split(',')[0].trim();
    }
    // Fallback
    if (!ip_address) {
      ip_address = req.connection.remoteAddress || req.socket.remoteAddress;
    }
    const user_agent = req.get('User-Agent') || '';

    // Import ViewTracking model
    const ViewTracking = require('../models/ViewTracking');

    // Track view với logic chống buff
    console.log('Tracking view with:', { user_id, ip_address, user_agent, resource_id: parseInt(id), resource_type: 'post' })
    const tracked = await ViewTracking.trackView({
      user_id,
      ip_address,
      user_agent,
      resource_id: parseInt(id),
      resource_type: 'post'
    });
    console.log('Tracked result:', tracked)

    // Kiểm tra post có tồn tại không
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    // Cập nhật view_count nếu chưa track (IP mới)
    let updated_view_count = post.view_count;
    if (tracked) {
      updated_view_count = post.view_count + 1;
      await Post.incrementViewCount(id);
    }

    res.json({
      success: true,
      message: tracked ? 'View tracked successfully' : 'View already tracked today',
      data: {
        tracked,
        post_id: parseInt(id),
        current_view_count: updated_view_count
      }
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
