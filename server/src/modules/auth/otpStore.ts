import { randomInt } from 'crypto';

type OtpEntry = {
  code: string;
  expiresAt: number;
  attempts: number;
  resendAvailableAt: number;
};

const store = new Map<string, OtpEntry>();

const CODE_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_TIMEOUT_MS = 60 * 1000;

export const otpStore = {
  generate(phone: string) {
    const code = randomInt(100000, 999999).toString();
    const now = Date.now();
    store.set(phone, {
      code,
      expiresAt: now + CODE_TTL_MS,
      attempts: 0,
      resendAvailableAt: now + RESEND_TIMEOUT_MS
    });
    return { code, ttlSeconds: CODE_TTL_MS / 1000, resendTimeout: RESEND_TIMEOUT_MS / 1000 };
  },
  canResend(phone: string) {
    const entry = store.get(phone);
    if (!entry) return true;
    return Date.now() >= entry.resendAvailableAt;
  },
  verify(phone: string, code: string) {
    const entry = store.get(phone);
    if (!entry) return { success: false, error: 'Код не найден' };
    if (Date.now() > entry.expiresAt) {
      store.delete(phone);
      return { success: false, error: 'Код истёк' };
    }
    if (entry.attempts >= MAX_ATTEMPTS) {
      return { success: false, error: 'Превышено количество попыток' };
    }
    entry.attempts += 1;
    if (entry.code === code) {
      store.delete(phone);
      return { success: true };
    }
    return { success: false, error: 'Неверный код' };
  },
  invalidate(phone: string) {
    store.delete(phone);
  }
};
