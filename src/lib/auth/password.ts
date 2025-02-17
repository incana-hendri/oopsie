import { hash, verify } from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    type: 2, // argon2id
    memoryCost: 65536, // 64MB
    timeCost: 3, // 3 iterations
    parallelism: 1, // 1 thread
  });
}

export async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
  return verify(hashedPassword, password);
}
