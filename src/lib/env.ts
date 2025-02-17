import { z } from 'zod';

const envSchema = z.object({
  // Database
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  DATABASE_URL: z.string().url(),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url().optional(),

  // Email
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().transform(Number),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email(),
});

export const env = envSchema.parse(process.env);

type ProcessEnv = z.infer<typeof envSchema>;
export type { ProcessEnv };
