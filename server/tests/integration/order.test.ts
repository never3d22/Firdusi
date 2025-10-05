import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { appRouter } from '../../src/trpc/router';

const dishes = [{ id: 1, priceCents: 5000, isActive: true, categoryId: 1 }];
const orders: any[] = [];

vi.mock('../../src/services/prisma', () => ({
  prisma: {
    dish: {
      findMany: vi.fn(async ({ where }: any) => dishes.filter((dish) => where.id?.in.includes(dish.id) && dish.isActive))
    },
    order: {
      create: vi.fn(async ({ data, include }: any) => {
        const order = { id: orders.length + 1, ...data, items: data.items.create };
        orders.push(order);
        return order;
      })
    }
  }
}));

const makeCaller = () => appRouter.createCaller({
  req: { headers: {}, ip: '127.0.0.1' } as FastifyRequest,
  res: {} as FastifyReply,
  prisma: {} as any,
  user: { id: 1, role: 'CUSTOMER' }
});

describe('order integration', () => {
  beforeEach(() => {
    orders.length = 0;
  });

  it('creates order with valid data', async () => {
    const caller = makeCaller();
    const result = await caller.public.createOrder({ items: [{ dishId: 1, qty: 3 }] });
    expect(result.totalCents).toBe(15000);
    expect(orders).toHaveLength(1);
  });

  it('fails when dish is missing', async () => {
    const caller = makeCaller();
    await expect(caller.public.createOrder({ items: [{ dishId: 99, qty: 1 }] })).rejects.toThrowError();
  });
});
