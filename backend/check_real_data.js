const mysql = require('mysql2/promise');

// Check real data in database
const checkRealData = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'yt_capital_db'
    });

    console.log('🔍 Checking real data in database...\n');

    // Check posts
    const [posts] = await connection.execute('SELECT COUNT(*) as count FROM posts');
    console.log(`📄 Posts: ${posts[0].count} records`);

    // Check investment knowledge
    const [knowledge] = await connection.execute('SELECT COUNT(*) as count FROM investment_knowledge');
    console.log(`💡 Investment Knowledge: ${knowledge[0].count} records`);

    // Check bookjourney
    const [books] = await connection.execute('SELECT COUNT(*) as count FROM bookjourney');
    console.log(`📚 BookJourney: ${books[0].count} records`);

    // Check view_tracking table
    const [viewTracking] = await connection.execute('SELECT COUNT(*) as count FROM view_tracking');
    console.log(`📊 View Tracking: ${viewTracking[0].count} records`);

    // Check if view_tracking table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'view_tracking'");
    if (tables.length === 0) {
      console.log('❌ view_tracking table does not exist!');
    } else {
      console.log('✅ view_tracking table exists');
    }

    // Show sample data from posts
    const [samplePosts] = await connection.execute('SELECT id, title, view_count FROM posts LIMIT 5');
    console.log('\n📄 Sample Posts:');
    samplePosts.forEach(post => {
      console.log(`  - ID: ${post.id}, Title: ${post.title}, Views: ${post.view_count}`);
    });

    // Show sample data from investment_knowledge
    const [sampleKnowledge] = await connection.execute('SELECT id, title, view_count FROM investment_knowledge LIMIT 5');
    console.log('\n💡 Sample Investment Knowledge:');
    sampleKnowledge.forEach(knowledge => {
      console.log(`  - ID: ${knowledge.id}, Title: ${knowledge.title}, Views: ${knowledge.view_count}`);
    });

    // Show sample data from bookjourney
    const [sampleBooks] = await connection.execute('SELECT id, title, view_count FROM bookjourney LIMIT 5');
    console.log('\n📚 Sample BookJourney:');
    sampleBooks.forEach(book => {
      console.log(`  - ID: ${book.id}, Title: ${book.title}, Views: ${book.view_count}`);
    });

    await connection.end();
    console.log('\n✅ Database check completed!');

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  }
};

checkRealData();
