import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "../api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";

export const serverSideHelper = createServerSideHelpers({
  router: appRouter,
  ctx: { session: null, prisma },
  transformer: superjson,
});
