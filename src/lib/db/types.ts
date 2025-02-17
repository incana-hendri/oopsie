import { timestamp, uuid, text, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Base columns for all tables
export const baseColumns = {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
};

// Columns for soft-deletable entities
export const softDeleteColumns = {
  ...baseColumns,
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
};

// Columns for tenant-isolated entities
export const tenantColumns = {
  ...baseColumns,
  squadId: uuid('squad_id').notNull(), // Reference will be added in the schema
};

// Columns for tenant-isolated and soft-deletable entities
export const tenantSoftDeleteColumns = {
  ...tenantColumns,
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
};

// Columns for audit logging
export const auditColumns = {
  ...baseColumns,
  actorId: uuid('actor_id').notNull(), // Reference will be added in the schema
  action: text('action').notNull(),
  details: jsonb('details'),
};

// Helper type for soft-deletable entities
export type SoftDeletable = {
  deletedAt: Date | null;
};

// Helper type for tenant-isolated entities
export type TenantIsolated = {
  squadId: string;
};

// Helper type for auditable entities
export type Auditable = {
  actorId: string;
  action: string;
  details?: Record<string, unknown>;
};
