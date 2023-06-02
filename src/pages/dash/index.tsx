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

const initialSurvey = {
  title: "",
  description: "",
  question: [],
};

const Dash = () => {
  //RouterOutputs to get type of the surveys
  const [survey, setSurvey] = useState<Survey>(initialSurvey);

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

  const handleDeleteQuestion = (id: string) => {
    //if user is deleting and only one question remains, it is safe to say the user is deleting the entire survey. Reset back to initial state
    if (question.length === 1) {
      setSurvey(initialSurvey);
      return;
    }
    const updatedQuestions = survey.question.filter((q) => id !== q.id);
    setSurvey({ ...survey, question: updatedQuestions });
  };

  useEffect(() => {
    console.log(survey);
  }, [survey]);

  return (
    <div className="hide flex h-full flex-col overflow-y-auto py-10 text-info-content">
      <h1 className="color mb-2 text-4xl ">Create Survey</h1>
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
          <div className="mb-9 flex max-w-2xl flex-col gap-2 rounded-lg border border-base-300 p-3 shadow-sm">
            <label htmlFor="survey name" className=" label-text label text-2xl">
              Survey Name
            </label>
            <input
              className="input-bordered input input-sm w-full max-w-xs"
              type="text"
              placeholder="Test"
              name="survey name"
              value={survey["title"]}
              onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
            />
          </div>
          {question.map((question) => (
            <Question
              key={question.id}
              question={question}
              handleUpdateQuestion={handleUpdateQuestion}
              handleDeleteQuestion={handleDeleteQuestion}
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
