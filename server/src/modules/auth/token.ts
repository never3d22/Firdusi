import jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'crypto';
import { env } from '../../config/env';
import { prisma } from '../../services/prisma';

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

type TokenPayload = {
  sub: number;
  role: string;
};

const hashToken = (token: string) => createHash('sha256').update(token + env.REFRESH_TOKEN_SALT).digest('hex');

export async function createTokenPair(userId: number, role: string, metadata: { userAgentHash: string; ipHash: string }) {
  const accessToken = jwt.sign({ sub: userId, role }, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL });
  const refreshRaw = randomBytes(64).toString('hex');
  const refreshToken = jwt.sign({ sub: userId, token: refreshRaw }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TTL });
  const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshRaw),
      userAgentHash: metadata.userAgentHash,
      ipHash: metadata.ipHash,
      expiresAt: new Date((decoded?.exp ?? 0) * 1000)
    }
  });

  return { accessToken, refreshToken, expiresIn: 15 * 60 } satisfies TokenPair;
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload & jwt.JwtPayload;
}

export async function rotateRefreshToken(refreshToken: string, metadata: { userAgentHash: string; ipHash: string }) {
  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as jwt.JwtPayload & { token: string };
    const tokenHash = hashToken(payload.token);

    const existing = await prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null
      }
    });

    if (!existing || existing.expiresAt < new Date()) {
      throw new Error('Refresh token invalid');
    }

    const user = await prisma.user.findUnique({ where: { id: existing.userId } });
    if (!user) throw new Error('User not found');

    await prisma.refreshToken.update({
      where: { id: existing.id },
      data: {
        revokedAt: new Date()
      }
    });

    return createTokenPair(existing.userId, user.role, metadata);
  } catch (error) {
    throw new Error('Refresh token invalid');
  }
}

export async function revokeRefreshTokens(userId: number) {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() }
  });
}

export async function revokeTokenByHash(token: string) {
  const payload = jwt.decode(token) as jwt.JwtPayload & { token: string } | null;
  if (!payload?.token) return;
  const tokenHash = hashToken(payload.token);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() }
  });
}

export const buildMetadata = (userAgent?: string, ip?: string) => ({
  userAgentHash: createHash('sha256').update(userAgent ?? 'unknown').digest('hex'),
  ipHash: createHash('sha256').update(ip ?? 'unknown').digest('hex')
});
