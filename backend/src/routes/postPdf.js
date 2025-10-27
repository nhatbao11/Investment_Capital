const express = require('express');
const router = express.Router();
const { downloadPdf } = require('../controllers/postPdfController');

/**
 * Download PDF route
 * GET /api/v1/posts/:id/pdf
 */
router.get('/:id/pdf', downloadPdf);

module.exports = router;
