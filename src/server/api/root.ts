import { createTRPCRouter } from "~/server/api/trpc";
import { surveyRouter } from "~/server/api/routers/surveys";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  survey: surveyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
