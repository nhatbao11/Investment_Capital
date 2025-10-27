const Post = require('../models/Post');

/**
 * Download PDF với track view (cho email links)
 */
const downloadPdf = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Lấy thông tin post
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        code: 'POST_NOT_FOUND'
      });
    }

    if (!post.pdf_url) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found',
        code: 'PDF_NOT_FOUND'
      });
    }

    // Track view khi mở PDF từ email (theo IP)
    const ViewTracking = require('../models/ViewTracking');
    const user_id = req.user?.id || null;
    const ip_address = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const user_agent = req.get('User-Agent') || '';

    await ViewTracking.trackView({
      user_id,
      ip_address,
      user_agent,
      resource_id: parseInt(id),
      resource_type: 'post'
    });

    // Redirect to PDF URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const pdfUrl = post.pdf_url.startsWith('http') ? post.pdf_url : `${frontendUrl}${post.pdf_url}`;
    
    res.redirect(pdfUrl);
  } catch (error) {
    console.error('Download PDF error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download PDF',
      code: 'DOWNLOAD_PDF_ERROR'
    });
  }
};

module.exports = {
  downloadPdf
};
