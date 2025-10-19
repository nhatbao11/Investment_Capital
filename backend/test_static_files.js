const express = require('express');
const path = require('path');
const app = express();

// Test static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Test URLs:');
  console.log(`- http://localhost:${PORT}/uploads/posts/post_1759167656559_ikwo1ksuy7.pdf`);
  console.log(`- http://localhost:${PORT}/uploads/reports/banking_sector_2024.pdf`);
});
