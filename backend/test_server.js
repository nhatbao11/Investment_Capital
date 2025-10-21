const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Test static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is running',
    uploadsPath: path.join(__dirname, 'uploads'),
    postsDir: path.join(__dirname, 'uploads', 'posts'),
    postsExists: fs.existsSync(path.join(__dirname, 'uploads', 'posts'))
  });
});

// Test specific file
app.get('/test-file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', 'posts', filename);
  
  if (fs.existsSync(filePath)) {
    res.json({
      success: true,
      message: 'File exists',
      path: filePath,
      size: fs.statSync(filePath).size
    });
  } else {
    res.json({
      success: false,
      message: 'File not found',
      path: filePath
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
    requestedUrl: req.url
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test URLs:`);
  console.log(`- http://localhost:${PORT}/test`);
  console.log(`- http://localhost:${PORT}/test-file/post_1760864950964_fcgg1j947lo.pdf`);
  console.log(`- http://localhost:${PORT}/uploads/posts/`);
});










