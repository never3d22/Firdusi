import { describe, it, expect, beforeEach, vi } from 'vitest';

const tokens: any[] = [];
const users = new Map<number, { id: number; role: string }>([[1, { id: 1, role: 'CUSTOMER' }]]);

vi.mock('../../src/services/prisma', () => ({
  prisma: {
    refreshToken: {
      create: vi.fn(async ({ data }) => {
        tokens.push({ ...data, id: tokens.length + 1, revokedAt: null });
        return tokens.at(-1);
      }),
      findFirst: vi.fn(async ({ where }: any) => tokens.find((t) => t.tokenHash === where.tokenHash && t.revokedAt === null) ?? null),
      update: vi.fn(async ({ where, data }: any) => {
        const token = tokens.find((t) => t.id === where.id);
        if (token) Object.assign(token, data);
        return token;
      }),
      updateMany: vi.fn(async ({ where, data }: any) => {
        let count = 0;
        tokens.forEach((token) => {
          if ((where.userId ? token.userId === where.userId : true) && (where.tokenHash ? token.tokenHash === where.tokenHash : true) && token.revokedAt === null) {
            Object.assign(token, data);
            count += 1;
          }
        });
        return { count };
      })
    },
    user: {
      findUnique: vi.fn(async ({ where }: any) => users.get(where.id) ?? null)
    }
  }
}));

import { buildMetadata, createTokenPair, rotateRefreshToken, revokeRefreshTokens } from '../../src/modules/auth/token';

describe('auth token utils', () => {
  beforeEach(() => {
    tokens.length = 0;
  });

  it('creates token pair and stores hashed refresh token', async () => {
    const metadata = buildMetadata('test-agent', '127.0.0.1');
    const { refreshToken, accessToken } = await createTokenPair(1, 'CUSTOMER', metadata);
    expect(refreshToken).toBeTruthy();
    expect(accessToken).toBeTruthy();
    expect(tokens).toHaveLength(1);
    expect(tokens[0].tokenHash).not.toEqual(refreshToken);
  });

  it('rotates refresh token and revokes previous one', async () => {
    const metadata = buildMetadata('test-agent', '127.0.0.1');
    const { refreshToken } = await createTokenPair(1, 'CUSTOMER', metadata);
    const rotated = await rotateRefreshToken(refreshToken, metadata);
    expect(rotated.refreshToken).toBeTruthy();
    expect(tokens[0].revokedAt).not.toBeNull();
    expect(tokens).toHaveLength(2);
  });

  it('revokes tokens by user', async () => {
    const metadata = buildMetadata('test-agent', '127.0.0.1');
    await createTokenPair(1, 'CUSTOMER', metadata);
    await revokeRefreshTokens(1);
    expect(tokens[0].revokedAt).not.toBeNull();
  });
});
