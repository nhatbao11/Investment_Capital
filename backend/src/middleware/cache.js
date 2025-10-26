const NodeCache = require('node-cache');

// Cache với TTL 5 phút cho dữ liệu thường xuyên truy cập
const cache = new NodeCache({ 
  stdTTL: 300, // 5 phút
  checkperiod: 60, // Kiểm tra mỗi phút
  useClones: false 
});

// Cache với TTL 1 giờ cho dữ liệu ít thay đổi
const longCache = new NodeCache({ 
  stdTTL: 3600, // 1 giờ
  checkperiod: 300, // Kiểm tra mỗi 5 phút
  useClones: false 
});

/**
 * Cache middleware cho API responses
 */
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    const key = `${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`;
    
    // Kiểm tra cache
    const cached = cache.get(key);
    if (cached) {
      console.log(`Cache hit for: ${key}`);
      return res.json(cached);
    }
    
    // Lưu response vào cache
    const originalSend = res.json;
    res.json = function(data) {
      cache.set(key, data, duration);
      console.log(`Cache set for: ${key}`);
      return originalSend.call(this, data);
    };
    
    next();
  };
};

/**
 * Cache cho statistics (ít thay đổi)
 */
const statsCacheMiddleware = (duration = 1800) => { // 30 phút
  return (req, res, next) => {
    const key = `stats:${req.originalUrl}:${JSON.stringify(req.query)}`;
    
    const cached = longCache.get(key);
    if (cached) {
      console.log(`Stats cache hit for: ${key}`);
      return res.json(cached);
    }
    
    const originalSend = res.json;
    res.json = function(data) {
      longCache.set(key, data, duration);
      console.log(`Stats cache set for: ${key}`);
      return originalSend.call(this, data);
    };
    
    next();
  };
};

/**
 * Invalidate cache khi có thay đổi dữ liệu
 */
const invalidateCache = (pattern) => {
  const keys = cache.keys();
  const longKeys = longCache.keys();
  
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.del(key);
      console.log(`Cache invalidated: ${key}`);
    }
  });
  
  longKeys.forEach(key => {
    if (key.includes(pattern)) {
      longCache.del(key);
      console.log(`Long cache invalidated: ${key}`);
    }
  });
};

/**
 * Cache cho database queries
 */
const queryCache = {
  set: (query, params, result, ttl = 300) => {
    const key = `query:${query}:${JSON.stringify(params)}`;
    cache.set(key, result, ttl);
  },
  
  get: (query, params) => {
    const key = `query:${query}:${JSON.stringify(params)}`;
    return cache.get(key);
  },
  
  invalidate: (table) => {
    invalidateCache(`query:${table}`);
  }
};

module.exports = {
  cacheMiddleware,
  statsCacheMiddleware,
  invalidateCache,
  queryCache,
  cache,
  longCache
};
