import { z } from 'zod';
import argon2 from 'argon2';
import { router, adminProcedure, publicProcedure } from '../context';
import { prisma } from '../../services/prisma';
import { buildMetadata, createTokenPair } from '../../modules/auth/token';

const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional()
}).optional();

export const adminRouter = router({
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string().min(4) }))
    .mutation(async ({ input, ctx }) => {
      const admin = await prisma.user.findUnique({ where: { phone: input.username } });
      if (!admin || admin.role !== 'ADMIN' || !admin.passwordHash) {
        throw new Error('Неверные учетные данные');
      }
      const valid = await argon2.verify(admin.passwordHash, input.password);
      if (!valid) {
        throw new Error('Неверные учетные данные');
      }
      const metadata = buildMetadata(ctx.req.headers['user-agent'], ctx.req.ip);
      const tokens = await createTokenPair(admin.id, admin.role, metadata);
      return { user: admin, ...tokens, mustChangePassword: input.password === process.env.ADMIN_DEFAULT_PASSWORD };
    }),
  categories: router({
    list: adminProcedure.query(async () => {
      return prisma.category.findMany({ orderBy: { position: 'asc' } });
    }),
    create: adminProcedure
      .input(z.object({ name: z.string().min(2), position: z.number().int().optional(), isActive: z.boolean().optional() }))
      .mutation(async ({ input }) => {
        return prisma.category.create({
          data: {
            name: input.name,
            position: input.position ?? 0,
            isActive: input.isActive ?? true
          }
        });
      }),
    update: adminProcedure
      .input(z.object({ id: z.number().int(), name: z.string().min(2), position: z.number().int(), isActive: z.boolean() }))
      .mutation(async ({ input }) => {
        return prisma.category.update({
          where: { id: input.id },
          data: {
            name: input.name,
            position: input.position,
            isActive: input.isActive
          }
        });
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ input }) => {
        await prisma.category.delete({ where: { id: input.id } });
        return { success: true };
      }),
    sort: adminProcedure
      .input(z.array(z.object({ id: z.number().int(), position: z.number().int() })))
      .mutation(async ({ input }) => {
        await Promise.all(input.map(({ id, position }) => prisma.category.update({ where: { id }, data: { position } })));
        return { success: true };
      })
  }),
  dishes: router({
    list: adminProcedure
      .input(z.object({ categoryId: z.number().int().optional() }).optional())
      .query(async ({ input }) => {
        return prisma.dish.findMany({
          where: {
            categoryId: input?.categoryId,
          },
          orderBy: { createdAt: 'desc' }
        });
      }),
    create: adminProcedure
      .input(z.object({
        name: z.string().min(2),
        description: z.string().optional(),
        priceCents: z.number().int().min(0),
        imageUrl: z.string().url().optional(),
        isActive: z.boolean().optional(),
        categoryId: z.number().int()
      }))
      .mutation(async ({ input }) => {
        return prisma.dish.create({ data: { ...input, isActive: input.isActive ?? true } });
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number().int(),
        name: z.string().min(2),
        description: z.string().optional(),
        priceCents: z.number().int().min(0),
        imageUrl: z.string().url().optional(),
        isActive: z.boolean(),
        categoryId: z.number().int()
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return prisma.dish.update({ where: { id }, data });
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ input }) => {
        await prisma.dish.delete({ where: { id: input.id } });
        return { success: true };
      })
  }),
  orders: router({
    list: adminProcedure
      .input(z.object({ status: z.string().optional(), range: dateRangeSchema }).optional())
      .query(async ({ input }) => {
        return prisma.order.findMany({
          where: {
            status: input?.status as any,
            createdAt: input?.range?.from || input?.range?.to ? {
              gte: input?.range?.from ? new Date(input.range.from) : undefined,
              lte: input?.range?.to ? new Date(input.range.to) : undefined
            } : undefined
          },
          include: { items: { include: { dish: true } }, user: true },
          orderBy: { createdAt: 'desc' }
        });
      }),
    get: adminProcedure
      .input(z.object({ id: z.number().int() }))
      .query(async ({ input }) => {
        return prisma.order.findUnique({
          where: { id: input.id },
          include: { items: { include: { dish: true } }, user: true }
        });
      }),
    updateStatus: adminProcedure
      .input(z.object({ id: z.number().int(), status: z.enum(['PENDING', 'PAID', 'COOKING', 'READY', 'DELIVERING', 'DONE', 'CANCELED']) }))
      .mutation(async ({ input }) => {
        return prisma.order.update({ where: { id: input.id }, data: { status: input.status } });
      })
  }),
  settings: router({
    get: adminProcedure.query(async () => {
      return prisma.restaurantSetting.findUnique({ where: { id: 1 } });
    }),
    update: adminProcedure
      .input(z.object({
        name: z.string().min(2),
        phone: z.string().optional(),
        address: z.string().optional(),
        isOpen: z.boolean(),
        workingHours: z.record(z.string()).optional()
      }))
      .mutation(async ({ input }) => {
        return prisma.restaurantSetting.upsert({
          where: { id: 1 },
          create: { ...input },
          update: { ...input }
        });
      })
  })
});
