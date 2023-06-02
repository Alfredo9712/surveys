import React, { useEffect, useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { MdAddBox } from "react-icons/md";

import type { GetServerSidePropsContext } from "next";
import Question from "~/components/Question";

export type DropdownType = "input" | "dropdown" | "textarea";

type Survey = {
  title: string;
  description?: string;
  question: QuestionType[];
};

export type QuestionType = {
  id: string;
  type: string;
  description: string;
};

const Dash = () => {
  //RouterOutputs to get type of the surveys
  const [survey, setSurvey] = useState<Survey>({
    title: "",
    description: "",
    question: [],
  });

  const { question } = survey;
  const handleUpdateQuestion = (id: string, question: QuestionType) => {
    const updatedQuestions = survey.question.map((q) =>
      q.id === id ? question : q
    );
    setSurvey({ ...survey, question: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setSurvey({
      ...survey,
      question: [
        ...survey.question,
        { type: "", id: self.crypto.randomUUID(), description: "" },
      ],
    });
  };

  useEffect(() => {
    console.log(survey);
  }, [survey]);

  return (
    <div className="hide flex h-full flex-col overflow-y-auto py-10">
      <h1 className="mb-2 text-4xl">Create Survey</h1>
      <div className="mb-5">
        <p className="text-md mb-3">
          Click below to add a question to your survey
        </p>
        <MdAddBox
          size={33}
          style={{ cursor: "pointer" }}
          onClick={handleAddQuestion}
        />
      </div>
      {question.length > 0 && (
        <div>
          <div className="mb-9 flex flex-col gap-2 rounded-lg border border-slate-300 p-3 shadow-sm">
            <label htmlFor="survey name" className=" label-text label text-2xl">
              Survey Name
            </label>
            <input
              className="input-bordered input input-sm w-full max-w-xs"
              type="text"
              placeholder="Test"
              name="survey name"
              onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
            />
          </div>
          {question.map((question) => (
            <Question
              key={question.id}
              question={question}
              handleUpdateQuestion={handleUpdateQuestion}
            />
          ))}
        </div>
      )}
      <button className="btn-secondary btn mt-auto max-w-[150px]">
        Save & Submit{" "}
      </button>
    </div>
  );
};

export default Dash;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
