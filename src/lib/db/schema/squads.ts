import { pgTable, text, jsonb } from 'drizzle-orm/pg-core';
import { softDeleteColumns } from '../types';

export const squads = pgTable('squads', {
  ...softDeleteColumns,
  name: text('name').notNull(),
  description: text('description'),
  settings: jsonb('settings').$type<{
    branding: {
      primaryColor?: string;
      secondaryColor?: string;
      logoUrl?: string;
    };
    notifications: {
      emailEnabled: boolean;
      browserEnabled: boolean;
      quietHours?: {
        start: string;
        end: string;
      };
    };
    points: {
      minPoints: number;
      maxPoints: number;
      defaultPoints: number;
    };
  }>(),
  active: text('active').notNull().default('active').$type<'active' | 'inactive' | 'suspended'>(),
});
