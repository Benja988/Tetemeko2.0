// test-db.js
import { connectDB } from '../config/db.js';

connectDB()
  .then(() => {
    console.log('✅ DB connection successful');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  });
