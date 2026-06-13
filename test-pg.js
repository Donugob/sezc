process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres.cjtcgxnotnwexzgufudu:gS01FzpXb7IrudIz@51.21.18.29:5432/postgres?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

pool.query('SELECT 1 as result')
  .then(res => {
    console.log('✅ Connected using pg:', res.rows[0]);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
