import type { FastifyRequest, FastifyReply } from 'fastify';
import { initTRPC } from '@trpc/server';
import type { inferAsyncReturnType } from '@trpc/server';
import { prisma } from '../services/prisma';
import { verifyAccessToken } from '../modules/auth/token';
import type { JwtPayload } from 'jsonwebtoken';

export async function createContext({ req, res }: { req: FastifyRequest; res: FastifyReply }) {
  const auth = req.headers.authorization;
  let user: { id: number; role: string } | null = null;

  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice(7);
    try {
      const payload = verifyAccessToken(token) as JwtPayload & { sub: number; role: string };
      user = { id: Number(payload.sub), role: payload.role };
    } catch (error) {
      // ignore invalid tokens, handled by procedures
    }
  }

  return {
    req,
    res,
    prisma,
    user
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new t.RPCError({ code: 'UNAUTHORIZED', message: 'Требуется авторизация' });
  }
  return next({ ctx: { user: ctx.user } });
});

const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'ADMIN') {
    throw new t.RPCError({ code: 'FORBIDDEN', message: 'Недостаточно прав' });
  }
  return next({ ctx: { user: ctx.user } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use(isAuthed);
export const adminProcedure = publicProcedure.use(isAdmin);
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;
