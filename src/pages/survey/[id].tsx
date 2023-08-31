import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { Formik } from "formik";
import { Fragment } from "react";

import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";

import { api } from "~/utils/api";
import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";

const SurveyPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { id } = props;

  const { data, isLoading } = api.survey.getById.useQuery({
    id,
  });

  const { mutate } = api.survey.submit.useMutation({
    onSuccess: () => {
      console.log("survey has been submitted");
    },
  });

  if (isLoading)
    return <h1 className="color mb-4 text-4xl ">Loading survey data</h1>;

  if (!data) return <h1 className="color mb-4 text-4xl ">Survey not found</h1>;

  const { isActive, title, question } = data;
  console.log(question);

  if (!question)
    return <h1 className="color mb-4 text-4xl ">Survey has no questions</h1>;

  if (!isActive)
    return <h1 className="color mb-4 text-4xl ">Survey is no longer active</h1>;

  return (
    <div className=" flex h-screen flex-col items-center pt-9">
      <Formik
        initialValues={{
          answers: question.map((q) => {
            if (q.type === "input" || q.type === "textArea") {
              return {
                questionId: q.id,
                text: "", // For text input questions
              };
            }
            return {
              questionId: q.id,
              value: 0, // For text input questions
            };
          }),
        }}
        onSubmit={(values) => {
          mutate({ answer: values.answers, surveyId: id });
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => {
          console.log(values);
          return (
            <div className="flex flex-col gap-8">
              <h1 className="color text-4xl ">{title}</h1>
              <form onSubmit={handleSubmit}>
                {question.map((q, index) => {
                  const { type, description } = question[index] || {};
                  return (
                    <div key={index} className="flex gap-2">
                      <div>{index + 1} -</div>
                      {type === "number" && (
                        <div className="mb-3 flex flex-col gap-2">
                          <label htmlFor={`answers.${index}.value`}>
                            {description}
                          </label>
                          <input
                            key={index}
                            type="text"
                            name={`answers.${index}.value`}
                            value={values.answers[index]?.value}
                            className="input-bordered input w-full max-w-xs"
                            onChange={(e) => {
                              if (isNaN(+e.target.value)) return;
                              void setFieldValue(
                                `answers.${index}.value`,
                                +e.target.value
                              );
                            }}
                          />
                        </div>
                      )}
                      {type === "input" && (
                        <div className="mb-3 flex flex-col gap-2">
                          <label htmlFor={`answers.${index}.text`}>
                            {description}
                          </label>
                          <input
                            key={index}
                            type="text"
                            name={`answers.${index}.text`}
                            value={values.answers[index]?.text}
                            className="input-bordered input w-full max-w-xs"
                            onChange={(e) => {
                              void setFieldValue(
                                `answers.${index}.text`,
                                e.target.value
                              );
                            }}
                          />
                        </div>
                      )}
                      {type === "textArea" && (
                        <div className="mb-3 flex flex-col gap-2">
                          <label htmlFor={`answers.${index}.text`}>
                            {description}
                          </label>
                          <textarea
                            key={index}
                            name={`answers.${index}.text`}
                            value={values.answers[index]?.text}
                            className="textarea-bordered textarea"
                            onChange={(e) => {
                              void setFieldValue(
                                `answers.${index}.text`,
                                e.target.value
                              );
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                <button
                  type="submit"
                  className="btn-secondary btn mt-9 max-w-[150px]"
                >
                  Submit
                </button>
              </form>
            </div>
          );
        }}
      </Formik>
    </div>
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
