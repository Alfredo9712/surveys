import { createServerSideHelpers } from "@trpc/react-query/server";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { api } from "~/utils/api";

import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { Formik } from "formik";
import { useMemo } from "react";

const SurveyPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { id } = props;

  const { data, isLoading } = api.survey.getById.useQuery({
    id,
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>Survey not found</div>;

  const { isActive, title, question } = data;

  if (!isActive) return <div>{title} is no longer active</div>;

  const mapIndex = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eigth",
    "ninth",
    "tenth",
  ];

  return (
    <Formik
      initialValues={{
        answers: question.map((q) => {
          if (q.type === "text" || q.type === "textArea") {
            return {
              questionId: q.id,
              input: "", // For text input questions
            };
          }
          return {
            questionId: q.id,
            input: 0, // For text input questions
          };
        }),
      }}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
      }}
    >
      {({ values, handleSubmit, handleChange, setFieldValue }) => {
        console.log(values);
        return (
          <form onSubmit={handleSubmit}>
            {question.map((q, index) => {
              return (
                <input
                  key={index}
                  type="text"
                  name={`answers.${index}.text`}
                  value={values.answers[index]?.input}
                  onChange={(e) => {
                    if (isNaN(+e.target.value)) return;

                    void setFieldValue(
                      `answers.${index}.input`,
                      +e.target.value
                    );
                  }}
                />
              );
            })}
          </form>
        );
      }}
    </Formik>
  );
};

export default SurveyPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const surveys = await prisma.survey.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: surveys.map((survey) => ({
      params: {
        id: survey.id,
      },
    })),
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson, // optional - adds superjson serialization
  });
  const id = context.params?.id as string;
  // prefetch `post.byId`
  await ssg.survey.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 1,
  };
}
