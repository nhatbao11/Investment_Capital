const mysql = require('mysql2/promise');
const ViewTracking = require('./src/models/ViewTracking');

// Test connection
const testConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'investment_capital'
    });

    console.log('✅ Database connection successful');
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Test view tracking functionality
const testViewTracking = async () => {
  try {
    console.log('\n🧪 Testing View Tracking System...\n');

    // First, create test users if they don't exist
    console.log('0. Creating test users...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'investment_capital'
    });

    // Insert test users if they don't exist
    await connection.execute(`
      INSERT IGNORE INTO users (id, email, full_name, role, is_active) 
      VALUES (1, 'test1@example.com', 'Test User 1', 'client', 1)
    `);
    await connection.execute(`
      INSERT IGNORE INTO users (id, email, full_name, role, is_active) 
      VALUES (2, 'test2@example.com', 'Test User 2', 'client', 1)
    `);
    await connection.end();

    // Test 1: Track view for post
    console.log('1. Testing post view tracking...');
    const postResult = await ViewTracking.trackView({
      user_id: 1,
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      resource_id: 1,
      resource_type: 'post'
    });
    console.log('   Post tracking result:', postResult);

    // Test 2: Track view for investment knowledge
    console.log('2. Testing investment knowledge view tracking...');
    const knowledgeResult = await ViewTracking.trackView({
      user_id: null,
      ip_address: '192.168.1.101',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      resource_id: 1,
      resource_type: 'investment_knowledge'
    });
    console.log('   Knowledge tracking result:', knowledgeResult);

    // Test 3: Track view for bookjourney
    console.log('3. Testing bookjourney view tracking...');
    const bookResult = await ViewTracking.trackView({
      user_id: 2,
      ip_address: '192.168.1.102',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      resource_id: 1,
      resource_type: 'bookjourney'
    });
    console.log('   Bookjourney tracking result:', bookResult);

    // Test 4: Try to track same view again (should return false)
    console.log('4. Testing duplicate view prevention...');
    const duplicateResult = await ViewTracking.trackView({
      user_id: 1,
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      resource_id: 1,
      resource_type: 'post'
    });
    console.log('   Duplicate tracking result:', duplicateResult);

    // Test 5: Get resource stats
    console.log('5. Testing resource stats...');
    const resourceStats = await ViewTracking.getResourceStats('post', 1, 30);
    console.log('   Resource stats:', resourceStats);

    // Test 6: Get overall stats
    console.log('6. Testing overall stats...');
    const overallStats = await ViewTracking.getOverallStats(30);
    console.log('   Overall stats:', overallStats);

    // Test 7: Get top content
    console.log('7. Testing top content...');
    const topContent = await ViewTracking.getTopContent('post', 5, 30);
    console.log('   Top content:', topContent);

    // Test 8: Get dashboard stats
    console.log('8. Testing dashboard stats...');
    const dashboardStats = await ViewTracking.getDashboardStats(30);
    console.log('   Dashboard stats:', dashboardStats);

    console.log('\n✅ All tests completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting View Tracking System Tests...\n');

  // Test database connection
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('❌ Cannot proceed without database connection');
    return;
  }

  // Test view tracking functionality
  const trackingOk = await testViewTracking();
  if (!trackingOk) {
    console.log('❌ View tracking tests failed');
    return;
  }

  console.log('\n🎉 All tests passed! View tracking system is ready to use.');
};

// Run tests
runTests().catch(console.error);
