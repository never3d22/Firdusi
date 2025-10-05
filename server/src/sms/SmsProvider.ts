export type SmsSendResult = {
  success: boolean;
  messageId?: string;
  error?: string;
};

export type SmsVerificationResult = {
  success: boolean;
  error?: string;
};

export interface SmsProvider {
  sendCode(phone: string, code: string, ttlSeconds: number): Promise<SmsSendResult>;
  verify?(...args: unknown[]): Promise<SmsVerificationResult>;
}
