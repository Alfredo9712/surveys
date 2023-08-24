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

  getSurveysById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const surveys = prisma.survey.findMany({
        where: { userId: input.id },
        include: {
          question: {
            include: {
              answer: true,
            },
          },
        },
      });

      return surveys;
    }),

  createSurvey: protectedProcedure
    .input(
      z.object({
        survey: z.object({
          title: z.string(),
          description: z.string(),
          question: z.array(questionSchema || []),
        }),
        id: z.string(),
      })
    )
    .mutation(({ input }) =>
      prisma.user.update({
        where: { id: input.id },
        data: {
          survey: {
            create: {
              title: input.survey.title,
              description: input.survey.description,
              question: {
                create: input.survey.question,
              },
            },
          },
        },
      })
    ),

  updateIsActiveById: protectedProcedure
    .input(z.object({ id: z.string(), isActive: z.boolean() }))
    .mutation(({ input }) => {
      const survey = prisma.survey.update({
        where: {
          id: input.id,
        },
        data: {
          isActive: input.isActive,
        },
      });

      return survey;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const survey = prisma.survey.findUnique({
        where: {
          id: input.id,
        },
        select: {
          description: true,
          isActive: true,
          question: true,
          title: true,
        },
      });

      return survey;
    }),

  submit: publicProcedure
    .input(
      z.object({
        answer: z.array(
          z.object({
            questionId: z.string(),
            text: z.string().optional(),
            value: z.number().optional(),
          })
        ),
        surveyId: z.string(),
      })
    )
    .mutation(({ input }) => {
      const { answer } = input;

      // await prisma.survey.update({
      //   where: {
      //     id: input.surveyId,
      //   },
      //   {answer.map(answer => {
      //     return {
      //       data: {
      //         question: {
      //           answer: answer
      //         }
      //       }
      //     }
      //   })}
      //   // data: {
      //   //   question: {
      //   //     updateMany: {

      //   //       // {answer.map(answer => )}
      //   //       // where: {
      //   //       //   id: "e",
      //   //       // },
      //   //       // data: {
      //   //       //   type: "text",
      //   //       // },
      //   //     },
      //   //   },
      //   // },
      // });
      answer.map(async (item) => {
        await prisma.answer.create({
          data: {
            questionId: item.questionId,
            text: item.text,
            value: item.value,
          },
        });
      });
      return;
    }),
});
