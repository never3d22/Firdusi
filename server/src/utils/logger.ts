import pino from 'pino';
import { env } from '../config/env';

export const logger = pino({
  transport: env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  } : undefined
});
