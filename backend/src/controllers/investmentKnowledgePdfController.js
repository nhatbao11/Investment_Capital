const InvestmentKnowledge = require('../models/InvestmentKnowledge');
const ViewTracking = require('../models/ViewTracking');
const path = require('path');
const fs = require('fs');

/**
 * Download PDF với track view (cho email links)
 */
const downloadPdf = async (req, res) => {
  try {
    const { id } = req.params;
    
    const knowledge = await InvestmentKnowledge.findById(id);
    
    if (!knowledge) {
      return res.status(404).json({
        success: false,
        message: 'Investment knowledge not found',
        code: 'INVESTMENT_KNOWLEDGE_NOT_FOUND'
      });
    }

    if (!knowledge.pdf_url) {
      return res.status(404).json({
        success: false,
        message: 'PDF not found',
        code: 'PDF_NOT_FOUND'
      });
    }

    // Track view khi mở PDF từ email (theo IP)
    const user_id = req.user?.id || null;
    const ip_address = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const user_agent = req.get('User-Agent') || '';

    await ViewTracking.trackView({
      user_id,
      ip_address,
      user_agent,
      resource_id: parseInt(id),
      resource_type: 'investment_knowledge'
    });

    // Serve PDF file trực tiếp từ server
    // Sử dụng process.cwd() để lấy root của backend project
    const normalizedPath = knowledge.pdf_url.startsWith('/uploads/') ? knowledge.pdf_url.substring(1) : knowledge.pdf_url;
    const pdfPath = path.join(process.cwd(), normalizedPath);
    const fileName = path.basename(knowledge.pdf_url);
    
    console.log('Attempting to serve PDF:', pdfPath);
    
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({
        success: false,
        message: 'PDF file not found on server',
        code: 'PDF_FILE_NOT_FOUND'
      });
    }

    // Set headers and send file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
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
