const BookJourney = require('./src/models/BookJourney');

async function debugBookJourney() {
  try {
    console.log('🔍 Debugging BookJourney...');
    
    // Test count method
    console.log('📊 Testing count method...');
    const count = await BookJourney.count({ status: 'published' });
    console.log('✅ Count result:', count);
    
    // Test getAll method
    console.log('📚 Testing getAll method...');
    const options = {
      page: 1,
      limit: 10,
      status: 'published',
      search: '',
      sortBy: 'created_at',
      sortOrder: 'DESC'
    };
    
    const books = await BookJourney.getAll(options);
    console.log('✅ Books found:', books.length);
    console.log('📖 First book:', books[0] ? books[0].title : 'No books');
    
    // Test Promise.all
    console.log('🔄 Testing Promise.all...');
    const [books2, total2] = await Promise.all([
      BookJourney.getAll(options),
      BookJourney.count(options)
    ]);
    console.log('✅ Promise.all result:', books2.length, total2);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

debugBookJourney();

