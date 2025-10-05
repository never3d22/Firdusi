process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'test-access-secret-test-access-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'test-refresh-secret-test-refresh-secret';
process.env.JWT_ACCESS_TTL = '15m';
process.env.JWT_REFRESH_TTL = '30d';
process.env.REFRESH_TOKEN_SALT = 'salt-for-tests-123456';
process.env.SMSRU_API_KEY = 'test';
process.env.ADMIN_DEFAULT_PASSWORD = '1234';
process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'mysql://user:pass@localhost:3306/test';
