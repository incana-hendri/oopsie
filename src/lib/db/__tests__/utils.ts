import { db, pool } from '../config';
import { seed } from '../seed';
import { sql } from 'drizzle-orm';

/**
 * Cleans up the test database by truncating all tables
 */
export async function cleanupTestDb() {
  const tables = ['notifications', 'seconds', 'ios', 'rankings', 'users', 'squads'];

  for (const table of tables) {
    await db.execute(sql.raw(`TRUNCATE TABLE ${table} CASCADE`));
  }
}

/**
 * Seeds the test database with sample data
 */
export async function seedTestDb() {
  await seed();
}

/**
 * Creates a clean database state for testing
 */
export async function setupTestDb() {
  await cleanupTestDb();
  await seedTestDb();
}

/**
 * Closes database connections after tests
 */
export async function teardownTestDb() {
  await pool.end();
}

/**
 * Gets a count of records in a table
 */
export async function getTableCount(table: string): Promise<number> {
  const result = await db.execute<{ count: string }>(sql.raw(`SELECT COUNT(*) FROM ${table}`));
  return parseInt(result.rows[0].count, 10);
}

/**
 * Checks if a record exists in a table
 */
export async function recordExists(
  table: string,
  conditions: Record<string, string | number | boolean>
): Promise<boolean> {
  const whereClause = Object.entries(conditions)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key} = '${value}'`;
      }
      return `${key} = ${value}`;
    })
    .join(' AND ');

  const result = await db.execute<{ exists: boolean }>(
    sql.raw(`SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${whereClause})`)
  );
  return result.rows[0].exists;
}
