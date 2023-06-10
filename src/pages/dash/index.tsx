import React, { useEffect, useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { MdAddBox } from "react-icons/md";

import type { GetServerSidePropsContext } from "next";
import Question from "~/components/Question";

export type DropdownType = "input" | "dropdown" | "textarea";

export type Survey = {
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

const Toast = ({ title = "Invalid form" }: { title?: string }) => {
  return (
    <div className="alert alert-error mb-5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{title}</span>
    </div>
  );
};

const Dash = () => {
  //RouterOutputs to get type of the surveys
  const [survey, setSurvey] = useState<Survey>(initialSurvey);
  const [isInvalidForm, setIsInavalidForm] = useState(false);
  const [toastTitle, setToastTitle] = useState("");

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

  const handleSubmitSurvey = () => {
    if (survey["title"] === "") return setIsInavalidForm(true);
  };

  useEffect(() => {
    console.log(survey);
  }, [survey]);

  // clear invalid form toast after 3.5 seconds
  useEffect(() => {
    if (!isInvalidForm) return;

    const invalidFormTimeout = setInterval(() => {
      setIsInavalidForm(false);
    }, 3500);

    return () => {
      clearInterval(invalidFormTimeout);
    };
  }, [isInvalidForm]);

  return (
    <div className="hide flex h-full flex-col overflow-y-auto py-10 text-info-content">
      {isInvalidForm && <Toast />}
      <h1 className="color mb-4 text-4xl ">Create Survey</h1>
      <div className="mb-5">
        <p className="text-md mb-3">
          {question.length <= 0
            ? "Click below to add a question to your survey"
            : "Click below to add another question"}
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
      <button
        className="btn-secondary btn mt-auto max-w-[150px]"
        onClick={handleSubmitSurvey}
      >
        Save & Submit
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
