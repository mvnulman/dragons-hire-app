import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { getEnv } from '../config/env.js';
import type { PrismaService } from '../prisma/prisma.service.js';

export const USER_ROLES = {
  CLIENT: 'CLIENT',
  KEEPER: 'KEEPER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Builds the Better Auth instance on top of the Nest-managed Prisma client, so
 * the whole application shares a single connection pool.
 */
export function createAuth(prisma: PrismaService) {
  const env = getEnv();

  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    basePath: '/api/auth',
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.WEB_ORIGIN],
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      autoSignIn: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          defaultValue: USER_ROLES.CLIENT,
          // Users must never be able to promote themselves on sign-up.
          input: false,
        },
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
