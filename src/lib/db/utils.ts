import { sql } from 'drizzle-orm';
import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import { db, pool } from './config';

const exec = promisify(execCb);

/**
 * Performs a health check on the database
 * @returns Object containing health status and connection pool metrics
 */
export async function checkDatabaseHealth() {
  try {
    // Test database connection
    await db.execute(sql`SELECT 1`);

    // Get connection pool metrics
    const poolMetrics = {
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount,
    };

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      poolMetrics,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Performs database cleanup operations
 * - Removes soft-deleted records older than retention period
 * - Vacuums the database to reclaim space
 * @param retentionDays Number of days to retain soft-deleted records
 */
export async function cleanupDatabase(retentionDays = 30) {
  const tables = ['users', 'squads', 'ios', 'seconds', 'rankings', 'notifications'];
  const timestamp = new Date();
  timestamp.setDate(timestamp.getDate() - retentionDays);

  try {
    // Hard delete soft-deleted records older than retention period
    for (const table of tables) {
      await db.execute(
        sql.raw(`
        DELETE FROM ${table}
        WHERE deleted_at IS NOT NULL
        AND deleted_at < '${timestamp.toISOString()}'
      `)
      );
    }

    // Vacuum the database to reclaim space
    await db.execute(sql.raw('VACUUM ANALYZE'));

    return {
      status: 'success',
      timestamp: new Date().toISOString(),
      message: `Cleaned up records older than ${retentionDays} days`,
    };
  } catch (error) {
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Monitors database performance
 * @returns Object containing performance metrics
 */
export async function monitorDatabasePerformance() {
  try {
    const metrics = await Promise.all([
      // Get table sizes
      db.execute(
        sql.raw(`
        SELECT
          relname as table_name,
          pg_size_pretty(pg_total_relation_size(relid)) as total_size,
          pg_size_pretty(pg_relation_size(relid)) as table_size,
          pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) as index_size
        FROM pg_catalog.pg_statio_user_tables
        ORDER BY pg_total_relation_size(relid) DESC
      `)
      ),

      // Get index usage statistics
      db.execute(
        sql.raw(`
        SELECT
          schemaname,
          relname as table_name,
          indexrelname as index_name,
          idx_scan as number_of_scans,
          idx_tup_read as tuples_read,
          idx_tup_fetch as tuples_fetched
        FROM pg_catalog.pg_statio_user_indexes
        ORDER BY idx_scan DESC
      `)
      ),

      // Get active connections
      db.execute(
        sql.raw(`
        SELECT count(*) as active_connections
        FROM pg_stat_activity
        WHERE state = 'active'
      `)
      ),
    ]);

    return {
      status: 'success',
      timestamp: new Date().toISOString(),
      metrics: {
        tableSizes: metrics[0],
        indexUsage: metrics[1],
        activeConnections: metrics[2],
      },
    };
  } catch (error) {
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Creates a backup of the database
 * Note: This requires pg_dump to be installed and accessible
 * @param backupPath Path where the backup file should be saved
 */
export async function backupDatabase(backupPath: string) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${backupPath}/backup-${timestamp}.sql`;

    const command = `pg_dump "${process.env.DATABASE_URL}" > "${filename}"`;
    await exec(command);

    return {
      status: 'success',
      timestamp,
      filename,
      message: 'Backup created successfully',
    };
  } catch (error) {
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Restores the database from a backup file
 * Note: This requires psql to be installed and accessible
 * @param backupFile Path to the backup file
 */
export async function restoreDatabase(backupFile: string) {
  try {
    const command = `psql "${process.env.DATABASE_URL}" < "${backupFile}"`;
    await exec(command);

    return {
      status: 'success',
      timestamp: new Date().toISOString(),
      message: 'Database restored successfully',
    };
  } catch (error) {
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
