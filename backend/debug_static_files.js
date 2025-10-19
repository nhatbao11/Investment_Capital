const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Static files
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
    filesExist: fs.existsSync(path.join(__dirname, 'uploads', 'posts'))
  });
});

// List files endpoint
app.get('/list-files', (req, res) => {
  try {
    const postsDir = path.join(__dirname, 'uploads', 'posts');
    const files = fs.readdirSync(postsDir);
    res.json({ files: files.slice(0, 10) }); // Show first 10 files
  } catch (error) {
    res.json({ error: error.message });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
  console.log(`Test URLs:`);
  console.log(`- http://localhost:${PORT}/test`);
  console.log(`- http://localhost:${PORT}/list-files`);
  console.log(`- http://localhost:${PORT}/uploads/posts/`);
});
