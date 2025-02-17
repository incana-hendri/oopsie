import { db } from './config';
import { squads, users, ios, seconds, rankings, notifications } from './schema';
import { hashPassword } from '../auth/password';

async function seed() {
  try {
    // Create squads
    const [squad1, squad2] = await Promise.all([
      db
        .insert(squads)
        .values({
          name: 'Engineering Team',
          description: 'Software engineering squad',
          settings: {
            branding: {
              primaryColor: '#0066cc',
              secondaryColor: '#003366',
              logoUrl: 'https://example.com/logo.png',
            },
            notifications: {
              emailEnabled: true,
              browserEnabled: true,
            },
            points: {
              minPoints: 1,
              maxPoints: 10,
              defaultPoints: 5,
            },
          },
          active: 'active',
        })
        .returning()
        .then(rows => rows[0]),
      db
        .insert(squads)
        .values({
          name: 'Design Team',
          description: 'Product design squad',
          settings: {
            branding: {
              primaryColor: '#ff6600',
              secondaryColor: '#cc3300',
              logoUrl: 'https://example.com/logo2.png',
            },
            notifications: {
              emailEnabled: true,
              browserEnabled: true,
            },
            points: {
              minPoints: 1,
              maxPoints: 10,
              defaultPoints: 5,
            },
          },
          active: 'active',
        })
        .returning()
        .then(rows => rows[0]),
    ]);

    // Create users
    const hashedPassword = await hashPassword('password123');
    const [user1, user2, user3, user4] = await Promise.all([
      db
        .insert(users)
        .values({
          squadId: squad1.id,
          username: 'johndoe',
          email: 'john@example.com',
          hashedPassword,
          fullName: 'John Doe',
          role: 'admin',
          settings: {
            theme: 'light',
            notifications: {
              email: true,
              browser: true,
            },
            language: 'en',
          },
          status: 'active',
        })
        .returning()
        .then(rows => rows[0]),
      db
        .insert(users)
        .values({
          squadId: squad1.id,
          username: 'janedoe',
          email: 'jane@example.com',
          hashedPassword,
          fullName: 'Jane Doe',
          role: 'member',
          settings: {
            theme: 'dark',
            notifications: {
              email: true,
              browser: true,
            },
            language: 'en',
          },
          status: 'active',
        })
        .returning()
        .then(rows => rows[0]),
      db
        .insert(users)
        .values({
          squadId: squad2.id,
          username: 'bobsmith',
          email: 'bob@example.com',
          hashedPassword,
          fullName: 'Bob Smith',
          role: 'admin',
          settings: {
            theme: 'system',
            notifications: {
              email: true,
              browser: true,
            },
            language: 'en',
          },
          status: 'active',
        })
        .returning()
        .then(rows => rows[0]),
      db
        .insert(users)
        .values({
          squadId: squad2.id,
          username: 'alicejones',
          email: 'alice@example.com',
          hashedPassword,
          fullName: 'Alice Jones',
          role: 'member',
          settings: {
            theme: 'light',
            notifications: {
              email: true,
              browser: true,
            },
            language: 'en',
          },
          status: 'active',
        })
        .returning()
        .then(rows => rows[0]),
    ]);

    // Create rankings
    await Promise.all([
      db.insert(rankings).values([
        {
          squadId: squad1.id,
          name: 'Rookie',
          minPoints: 0,
          maxPoints: 50,
        },
        {
          squadId: squad1.id,
          name: 'Pro',
          minPoints: 51,
          maxPoints: 100,
        },
        {
          squadId: squad1.id,
          name: 'Expert',
          minPoints: 101,
          maxPoints: 200,
        },
      ]),
      db.insert(rankings).values([
        {
          squadId: squad2.id,
          name: 'Beginner',
          minPoints: 0,
          maxPoints: 50,
        },
        {
          squadId: squad2.id,
          name: 'Intermediate',
          minPoints: 51,
          maxPoints: 100,
        },
        {
          squadId: squad2.id,
          name: 'Master',
          minPoints: 101,
          maxPoints: 200,
        },
      ]),
    ]);

    // Create IOs
    const [io1, io2] = await Promise.all([
      db
        .insert(ios)
        .values({
          squadId: squad1.id,
          targetUserId: user2.id,
          nominatorId: user1.id,
          title: 'Late to standup',
          description: 'Was 15 minutes late to the daily standup',
          points: 5,
          status: 'nominated',
        })
        .returning()
        .then(rows => rows[0]),
      db
        .insert(ios)
        .values({
          squadId: squad2.id,
          targetUserId: user4.id,
          nominatorId: user3.id,
          title: 'Missed design review',
          description: 'Did not attend the scheduled design review session',
          points: 8,
          status: 'nominated',
        })
        .returning()
        .then(rows => rows[0]),
    ]);

    // Create seconds
    await Promise.all([
      db.insert(seconds).values({
        squadId: squad1.id,
        ioId: io1.id,
        userId: user1.id,
      }),
      db.insert(seconds).values({
        squadId: squad2.id,
        ioId: io2.id,
        userId: user3.id,
      }),
    ]);

    // Create notifications
    await Promise.all([
      db.insert(notifications).values({
        squadId: squad1.id,
        userId: user2.id,
        type: 'io_nominated',
        content: 'You have been nominated for an infraction: Late to standup',
      }),
      db.insert(notifications).values({
        squadId: squad2.id,
        userId: user4.id,
        type: 'io_nominated',
        content: 'You have been nominated for an infraction: Missed design review',
      }),
    ]);

    console.log('✅ Seed data created successfully');
  } catch (error) {
    console.error('❌ Error creating seed data:', error);
    throw error;
  }
}

export { seed };
