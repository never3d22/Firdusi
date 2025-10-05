import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

function getFlagValue(flag: string): string | undefined {
  const index = process.argv.indexOf(`--${flag}`);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) return undefined;
  return value;
}

async function main() {
  const phone = getFlagValue('phone');
  const password = getFlagValue('password');

  if (!phone || !password) {
    console.error('Usage: pnpm --filter server run admin:password -- --phone <login_or_phone> --password <new_password>');
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

    const user = await prisma.user.upsert({
      where: { phone },
      update: { passwordHash },
      create: { phone, role: 'ADMIN', passwordHash }
    });

    console.log(`Password updated for admin user with phone/login "${user.phone}".`);
  } catch (error) {
    console.error('Failed to update password:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
