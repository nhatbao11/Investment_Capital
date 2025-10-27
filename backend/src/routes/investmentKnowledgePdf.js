const express = require('express');
const router = express.Router();
const { downloadPdf } = require('../controllers/investmentKnowledgePdfController');

/**
 * Download PDF route
 * GET /api/v1/investment-knowledge/:id/pdf
 */
router.get('/:id/pdf', downloadPdf);

module.exports = router;
