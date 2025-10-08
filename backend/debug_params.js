const BookJourney = require('./src/models/BookJourney');

async function debugParams() {
  try {
    console.log('🔍 Debugging parameters...');
    
    const options = {
      page: 1,
      limit: 10,
      status: 'published',
      search: '',
      sortBy: 'created_at',
      sortOrder: 'DESC'
    };
    
    console.log('📋 Options:', options);
    
    const {
      page = 1,
      limit = 10,
      status = 'published',
      search = '',
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;
    let sql = `
      SELECT bj.*, u.full_name as author_name
      FROM bookjourney bj
      LEFT JOIN users u ON bj.author_id = u.id
      WHERE 1=1
    `;
    
    const params = [];

    // Filter by status
    if (status) {
      sql += ' AND bj.status = ?';
      params.push(status);
    }

    // Search
    if (search) {
      sql += ' AND (bj.title LIKE ? OR bj.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Sort
    sql += ` ORDER BY bj.${sortBy} ${sortOrder}`;

    // Pagination
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    console.log('📝 SQL:', sql);
    console.log('📊 Params:', params);
    console.log('🔢 Param count:', params.length);
    
    // Count placeholders
    const placeholderCount = (sql.match(/\?/g) || []).length;
    console.log('❓ Placeholder count:', placeholderCount);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

debugParams();

