import { pgTable, text, timestamp, jsonb, unique } from 'drizzle-orm/pg-core';
import { tenantSoftDeleteColumns } from '../types';

export const users = pgTable(
  'users',
  {
    ...tenantSoftDeleteColumns,
    username: text('username').notNull(),
    email: text('email').notNull(),
    hashedPassword: text('hashed_password').notNull(),
    fullName: text('full_name').notNull(),
    avatarUrl: text('avatar_url'),
    role: text('role').notNull().default('member').$type<'super-admin' | 'admin' | 'member'>(),
    settings: jsonb('settings').$type<{
      theme: 'light' | 'dark' | 'system';
      notifications: {
        email: boolean;
        browser: boolean;
      };
      language: string;
    }>(),
    lastLogin: timestamp('last_login', { withTimezone: true }),
    status: text('status').notNull().default('active').$type<'active' | 'inactive' | 'suspended'>(),
  },
  table => ({
    // Add unique constraint for username per squad
    squadUsername: unique().on(table.squadId, table.username),
    // Add unique constraint for email
    email: unique().on(table.email),
  })
);
