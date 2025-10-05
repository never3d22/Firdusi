import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../context';
import { otpStore } from '../../modules/auth/otpStore';
import { smsProvider } from '../../services/sms';
import { prisma } from '../../services/prisma';
import { createTokenPair, buildMetadata, rotateRefreshToken, revokeTokenByHash } from '../../modules/auth/token';
import { env } from '../../config/env';

const phoneSchema = z.string().regex(/^\+7\d{10}$/);

export const publicRouter = router({
  sendSmsCode: publicProcedure
    .input(z.object({ phone: phoneSchema }))
    .mutation(async ({ input }) => {
      if (!otpStore.canResend(input.phone)) {
        throw new Error('Запросите код позднее');
      }
      const { code, ttlSeconds, resendTimeout } = otpStore.generate(input.phone);
      const result = await smsProvider.sendCode(input.phone, code, ttlSeconds);
      if (!result.success) {
        throw new Error(result.error ?? 'Не удалось отправить код');
      }
      return { ttlSeconds, resendTimeout };
    }),
  verifySmsCode: publicProcedure
    .input(z.object({ phone: phoneSchema, code: z.string().length(6), name: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const verification = otpStore.verify(input.phone, input.code);
      if (!verification.success) {
        throw new Error(verification.error ?? 'Неверный код');
      }

      const user = await prisma.user.upsert({
        where: { phone: input.phone },
        update: {
          name: input.name ?? undefined
        },
        create: {
          phone: input.phone,
          name: input.name
        }
      });

      const metadata = buildMetadata(ctx.req.headers['user-agent'], ctx.req.ip);
      const tokens = await createTokenPair(user.id, user.role, metadata);

      return {
        user,
        ...tokens
      };
    }),
  refreshSession: publicProcedure
    .input(z.object({ refreshToken: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const metadata = buildMetadata(ctx.req.headers['user-agent'], ctx.req.ip);
      return rotateRefreshToken(input.refreshToken, metadata);
    }),
  revokeRefresh: protectedProcedure
    .input(z.object({ refreshToken: z.string() }))
    .mutation(async ({ input }) => {
      await revokeTokenByHash(input.refreshToken);
      return { success: true };
    }),
  getCategories: publicProcedure.query(async () => {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' }
    });
  }),
  getDishesByCategory: publicProcedure
    .input(z.object({ categoryId: z.number().int() }))
    .query(async ({ input }) => {
      return prisma.dish.findMany({
        where: { categoryId: input.categoryId, isActive: true },
        orderBy: { createdAt: 'desc' }
      });
    }),
  searchDishes: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      return prisma.dish.findMany({
        where: {
          isActive: true,
          name: { contains: input.query }
        },
        orderBy: { name: 'asc' }
      });
    }),
  createOrder: protectedProcedure
    .input(z.object({
      items: z.array(z.object({ dishId: z.number().int(), qty: z.number().int().min(1) })).min(1),
      addressId: z.number().int().optional(),
      comment: z.string().max(500).optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const dishes = await prisma.dish.findMany({
        where: { id: { in: input.items.map((i) => i.dishId) }, isActive: true }
      });
      if (dishes.length !== input.items.length) {
        throw new Error('Некоторые блюда недоступны');
      }
      const totalCents = input.items.reduce((total, item) => {
        const dish = dishes.find((d) => d.id === item.dishId);
        if (!dish) throw new Error('Блюдо не найдено');
        return total + dish.priceCents * item.qty;
      }, 0);

      const order = await prisma.order.create({
        data: {
          userId: ctx.user!.id,
          addressId: input.addressId,
          totalCents,
          items: {
            create: input.items.map((item) => ({
              dishId: item.dishId,
              qty: item.qty,
              priceCents: dishes.find((d) => d.id === item.dishId)!.priceCents
            }))
          },
          status: 'PENDING'
        },
        include: { items: true }
      });

      const paymentIntent = env.PAYMENT_PROVIDER === 'stripe' ? { clientSecret: 'todo-stripe-intent' } : null;

      return { orderId: order.id, totalCents, paymentIntent };
    }),
  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    return prisma.order.findMany({
      where: { userId: ctx.user!.id },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { dish: true } } }
    });
  }),
  getMyAddresses: protectedProcedure.query(async ({ ctx }) => {
    return prisma.address.findMany({
      where: { userId: ctx.user!.id },
      orderBy: { createdAt: 'desc' }
    });
  }),
  upsertMyAddress: protectedProcedure
    .input(z.object({
      id: z.number().int().optional(),
      label: z.string().min(2),
      street: z.string().min(3),
      city: z.string().min(2),
      comment: z.string().max(255).optional(),
      lat: z.number().optional(),
      lng: z.number().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      if (input.id) {
        return prisma.address.update({
          where: { id: input.id, userId: ctx.user!.id },
          data: {
            label: input.label,
            street: input.street,
            city: input.city,
            comment: input.comment,
            lat: input.lat,
            lng: input.lng
          }
        });
      }
      return prisma.address.create({
        data: {
          userId: ctx.user!.id,
          label: input.label,
          street: input.street,
          city: input.city,
          comment: input.comment,
          lat: input.lat,
          lng: input.lng
        }
      });
    }),
  deleteMyAddress: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      await prisma.address.delete({ where: { id: input.id, userId: ctx.user!.id } });
      return { success: true };
    })
});
