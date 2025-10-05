import { router } from './context';
import { publicRouter } from './routers/public';
import { adminRouter } from './routers/admin';

export const appRouter = router({
  public: publicRouter,
  admin: adminRouter
});

export type AppRouter = typeof appRouter;
