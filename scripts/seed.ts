import { seed } from '../src/lib/db/seed';

async function main() {
  try {
    await seed();
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  }
}

main();
