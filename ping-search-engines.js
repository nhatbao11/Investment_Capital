// Ping Google và Bing để thông báo có sitemap mới
const pingSearchEngines = async () => {
  const sitemapUrl = 'https://yt2future.com/sitemap.xml';
  
  const pingUrls = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
  ];

  for (const url of pingUrls) {
    try {
      const response = await fetch(url);
      console.log(`Pinged ${url}: ${response.status}`);
    } catch (error) {
      console.error(`Failed to ping ${url}:`, error);
    }
  }
};

// Chạy khi deploy
pingSearchEngines();
