import { describe, it, expect, vi } from 'vitest';
import { SmsRuProvider } from '../../src/sms/SmsRuProvider';

describe('SmsRuProvider', () => {
  it('sends sms successfully', async () => {
    const provider = new SmsRuProvider();
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({
        status: 'OK',
        status_code: 100,
        status_text: 'OK',
        sms: {
          '123': { status: 100, status_text: 'OK', sms_id: 'abc' }
        }
      })
    });
    // @ts-ignore
    global.fetch = mockFetch;

    const result = await provider.sendCode('+79998887766', '123456', 300);
    expect(result.success).toBe(true);
    expect(result.messageId).toBe('abc');
  });

  it('handles api error', async () => {
    const provider = new SmsRuProvider();
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({ status: 'ERROR', status_text: 'Invalid key', status_code: -1 })
    });
    // @ts-ignore
    global.fetch = mockFetch;

    const result = await provider.sendCode('+79998887766', '123456', 300);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid key');
  });
});
