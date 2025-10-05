import { env } from '../config/env';
import type { SmsProvider, SmsSendResult } from './SmsProvider';

interface SmsRuResponse {
  status: 'OK' | 'ERROR';
  status_code: number;
  status_text: string;
  sms?: Record<string, { status: number; status_text: string; sms_id?: string }>;
}

export class SmsRuProvider implements SmsProvider {
  async sendCode(phone: string, code: string, ttlSeconds: number): Promise<SmsSendResult> {
    const url = new URL('https://sms.ru/sms/send');
    url.searchParams.set('api_id', env.SMSRU_API_KEY);
    url.searchParams.set('to', phone);
    url.searchParams.set('msg', `Код авторизации Codex: ${code}. Срок действия ${Math.floor(ttlSeconds / 60)} мин.`);
    url.searchParams.set('json', '1');

    try {
      const response = await fetch(url.toString());
      const data = await response.json() as SmsRuResponse;

      if (data.status !== 'OK') {
        return {
          success: false,
          error: data.status_text
        };
      }

      const firstMessage = data.sms ? Object.values(data.sms)[0] : undefined;

      if (firstMessage && firstMessage.status === 100) {
        return {
          success: true,
          messageId: firstMessage.sms_id
        };
      }

      return {
        success: false,
        error: firstMessage?.status_text ?? 'Не удалось отправить SMS'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'SmsRuProvider: неизвестная ошибка'
      };
    }
  }
}
