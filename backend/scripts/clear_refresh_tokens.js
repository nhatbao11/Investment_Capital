const { executeQuery, pool } = require('../src/config/database');

(async () => {
	try {
		const result = await executeQuery('DELETE FROM refresh_tokens');
		console.log('Deleted refresh tokens:', result.affectedRows || 0);
	} catch (e) {
		console.error('Failed to clear refresh tokens:', e && e.message ? e.message : e);
	} finally {
		try { await pool.end(); } catch (_) {}
	}
})();












