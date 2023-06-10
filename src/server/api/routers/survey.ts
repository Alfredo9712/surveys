import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

const questionSchema = z.object({
  id: z.string(),
  type: z.string(),
  description: z.string(),
});

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
        include: {
          question: true,
        },
      });

      return survey;
    }),

  create: protectedProcedure
    .input(
      z.object({
        survey: z.object({
          title: z.string(),
          description: z.string(),
          question: z.array(questionSchema),
        }),
      })
    )
    .query(({ input }) =>
      prisma.survey.create({
        data: {
          title: input.survey.title,
          description: input.survey.description,
          question: {
            create: input.survey.question,
          },
        },
      })
    ),
});
