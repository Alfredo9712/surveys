import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const surveyRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const survey = prisma.survey.findMany({
        where: {
          id: input.id,
        },
      });

      return survey;
    }),
});
