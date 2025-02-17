import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../env';

// Create a connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
});

// Create a Drizzle instance
export const db = drizzle(pool);

// Export pool for direct access if needed
export { pool };
