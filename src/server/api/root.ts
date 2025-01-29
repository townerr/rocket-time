import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { timesheetRouter } from "~/server/api/routers/timesheet";
import { profileRouter } from "~/server/api/routers/profile";
import { managerRouter } from "~/server/api/routers/manager";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  timesheet: timesheetRouter,
  profile: profileRouter,
  manager: managerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
