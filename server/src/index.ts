import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { env } from './config/env';
import { logger } from './utils/logger';
import { appRouter } from './trpc/router';
import { createContext } from './trpc/context';

const server = Fastify({ logger });

await server.register(helmet);
await server.register(sensible);
await server.register(fastifyCors, {
  origin: env.NODE_ENV === 'development' ? true : [env.PUBLIC_WEB_APP_URL ?? 'https://codex.example.com'],
  credentials: true
});
await server.register(rateLimit, {
  max: env.RATE_LIMIT_MAX,
  timeWindow: env.RATE_LIMIT_WINDOW
});

server.get('/health', async () => ({ status: 'ok' }));

await server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext
  }
});

server.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  const statusCode = error.statusCode ?? 500;
  reply.status(statusCode).send({
    message: error.message,
    code: error.code ?? 'INTERNAL_SERVER_ERROR'
  });
});

server.listen({ port: env.PORT, host: '0.0.0.0' }).catch((error) => {
  server.log.error(error, 'Failed to start server');
  process.exit(1);
});
