import { pgTable, text, integer, uuid } from 'drizzle-orm/pg-core';
import { tenantColumns } from '../types';
import { users } from './users';

export const ios = pgTable('ios', {
  ...tenantColumns,
  targetUserId: uuid('target_user_id')
    .notNull()
    .references(() => users.id),
  nominatorId: uuid('nominator_id')
    .notNull()
    .references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  proofImage: text('proof_image'), // Base64 encoded image
  status: text('status')
    .notNull()
    .default('nominated')
    .$type<'nominated' | 'seconded' | 'accepted' | 'paid' | 'voided'>(),
  points: integer('points').notNull(),
});

export const seconds = pgTable('seconds', {
  ...tenantColumns,
  ioId: uuid('io_id')
    .notNull()
    .references(() => ios.id),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
});

export const rankings = pgTable('rankings', {
  ...tenantColumns,
  name: text('name').notNull(),
  minPoints: integer('min_points').notNull(),
  maxPoints: integer('max_points').notNull(),
});

export const notifications = pgTable('notifications', {
  ...tenantColumns,
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  type: text('type')
    .notNull()
    .$type<
      'io_nominated' | 'io_seconded' | 'io_accepted' | 'io_paid' | 'io_voided' | 'rank_changed'
    >(),
  content: text('content').notNull(),
  readAt: text('read_at'),
});
