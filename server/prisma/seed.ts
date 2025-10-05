import { PrismaClient, UserRole } from '@prisma/client';
import argon2 from 'argon2';
import { env } from '../src/config/env';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await argon2.hash(env.ADMIN_DEFAULT_PASSWORD, { type: argon2.argon2id });

  await prisma.user.upsert({
    where: { phone: 'admin' },
    update: {
      role: UserRole.ADMIN,
      passwordHash: adminPasswordHash
    },
    create: {
      phone: 'admin',
      role: UserRole.ADMIN,
      passwordHash: adminPasswordHash
    }
  });

  const categories = await prisma.category.createMany({
    data: [
      { name: 'Популярное', position: 1 },
      { name: 'Горячие блюда', position: 2 },
      { name: 'Десерты', position: 3 },
      { name: 'Напитки', position: 4 }
    ],
    skipDuplicates: true
  });

  console.log(`Inserted categories: ${categories.count}`);

  const category = await prisma.category.findFirst({ where: { position: 1 } });

  if (category) {
    await prisma.dish.createMany({
      data: [
        {
          name: 'Паста с лососем',
          description: 'Свежая паста с лососем и сливочным соусом',
          priceCents: 89000,
          imageUrl: 'https://placehold.co/600x400',
          categoryId: category.id
        },
        {
          name: 'Бургер фирменный',
          description: 'Сочная котлета, соус шефа и карамелизированный лук',
          priceCents: 69000,
          imageUrl: 'https://placehold.co/600x400',
          categoryId: category.id
        }
      ],
      skipDuplicates: true
    });
  }

  await prisma.restaurantSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Firdusi',
      phone: '+7 000 000 00 00',
      address: 'г. Москва, ул. Пушкина, 10',
      workingHours: {
        monday: '10:00-22:00',
        tuesday: '10:00-22:00',
        wednesday: '10:00-22:00',
        thursday: '10:00-22:00',
        friday: '10:00-23:00',
        saturday: '11:00-23:00',
        sunday: '11:00-21:00'
      }
    }
  });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
