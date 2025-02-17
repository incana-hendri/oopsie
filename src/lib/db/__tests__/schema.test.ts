import { describe, expect, test, beforeAll, afterAll } from 'vitest';
import { db } from '../config';
import { setupTestDb, teardownTestDb, getTableCount, recordExists } from './utils';
import { squads, users, ios } from '../schema';

describe('Database Schema', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  describe('Seed Data', () => {
    test('should create correct number of records', async () => {
      expect(await getTableCount('squads')).toBe(2);
      expect(await getTableCount('users')).toBe(4);
      expect(await getTableCount('rankings')).toBe(6);
      expect(await getTableCount('ios')).toBe(2);
      expect(await getTableCount('seconds')).toBe(2);
      expect(await getTableCount('notifications')).toBe(2);
    });

    test('should create squads with correct data', async () => {
      const engineeringSquad = await recordExists('squads', {
        name: 'Engineering Team',
        description: 'Software engineering squad',
        active: 'active',
      });

      const designSquad = await recordExists('squads', {
        name: 'Design Team',
        description: 'Product design squad',
        active: 'active',
      });

      expect(engineeringSquad).toBe(true);
      expect(designSquad).toBe(true);
    });

    test('should create users with correct roles', async () => {
      const adminUser = await recordExists('users', {
        username: 'johndoe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
      });

      const memberUser = await recordExists('users', {
        username: 'janedoe',
        email: 'jane@example.com',
        role: 'member',
        status: 'active',
      });

      expect(adminUser).toBe(true);
      expect(memberUser).toBe(true);
    });

    test('should create rankings with correct points', async () => {
      const rookieRank = await recordExists('rankings', {
        name: 'Rookie',
        min_points: 0,
        max_points: 50,
      });

      const proRank = await recordExists('rankings', {
        name: 'Pro',
        min_points: 51,
        max_points: 100,
      });

      expect(rookieRank).toBe(true);
      expect(proRank).toBe(true);
    });

    test('should create IOs with correct status', async () => {
      const nominatedIO = await recordExists('ios', {
        title: 'Late to standup',
        status: 'nominated',
        points: 5,
      });

      expect(nominatedIO).toBe(true);
    });
  });

  describe('Schema Constraints', () => {
    test('should enforce unique username per squad', async () => {
      const squad = await db.select().from(squads).limit(1);

      // Try to create a user with the same username in the same squad
      const createDuplicateUser = async () => {
        await db.insert(users).values({
          squadId: squad[0].id,
          username: 'johndoe',
          email: 'another@example.com',
          hashedPassword: 'dummy',
          fullName: 'Another John',
          role: 'member',
          status: 'active',
        });
      };

      await expect(createDuplicateUser()).rejects.toThrow();
    });

    test('should enforce unique email across all users', async () => {
      // Try to create a user with an existing email
      const createDuplicateEmail = async () => {
        await db.insert(users).values({
          squadId: 'some-uuid',
          username: 'newuser',
          email: 'john@example.com',
          hashedPassword: 'dummy',
          fullName: 'New User',
          role: 'member',
          status: 'active',
        });
      };

      await expect(createDuplicateEmail()).rejects.toThrow();
    });

    test('should enforce foreign key constraints', async () => {
      // Try to create an IO with non-existent user
      const createInvalidIO = async () => {
        await db.insert(ios).values({
          squadId: 'some-uuid',
          targetUserId: 'non-existent-user',
          nominatorId: 'non-existent-user',
          title: 'Invalid IO',
          description: 'This should fail',
          points: 5,
          status: 'nominated',
        });
      };

      await expect(createInvalidIO()).rejects.toThrow();
    });
  });
});
