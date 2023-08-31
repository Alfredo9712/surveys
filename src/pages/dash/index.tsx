import React, { useEffect, useState } from "react";
import { MdAddBox } from "react-icons/md";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

import Question from "~/components/Question";

import { authOptions } from "../../server/auth";
import { api } from "~/utils/api";

import type { GetServerSidePropsContext } from "next";

export type DropdownType = "input" | "dropdown" | "textarea" | "number";

export type Survey = {
  title: string;
  description: string;
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

export const Toast = ({
  message = "Invalid form",
  type,
  setShowToast,
}: {
  message: string;
  type: string;
  setShowToast: (showToast: boolean) => void;
}) => {
  return (
    <div className={`alert ${type} mb-5`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 cursor-pointer stroke-current"
        fill="none"
        viewBox="0 0 24 24"
        onClick={() => setShowToast(false)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};

const Dash = () => {
  const { data: sessionData } = useSession();
  const [survey, setSurvey] = useState<Survey>(initialSurvey);
  const [showToast, setShowToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({ message: "", type: "" });
  const topDivRef = React.useRef<HTMLDivElement>(null);
  const { question } = survey;

  // clear invalid form toast after 3.5 seconds
  useEffect(() => {
    if (!showToast) return;

    const invalidFormTimeout = setInterval(() => {
      setShowToast(false);
      setToastInfo({ message: "", type: "" });
    }, 3500);

    return () => {
      clearInterval(invalidFormTimeout);
    };
  }, [showToast]);

  if (!sessionData?.user?.id) {
    return <h1>Not authorized</h1>;
  }
  const ctx = api.useContext();

  const { mutate, isLoading } = api.survey.createSurvey.useMutation({
    onSuccess: () => {
      setSurvey(initialSurvey);
      setToastInfo({
        message: "Survey created successfully",
        type: "alert-success",
      });
      setShowToast(true);
      void ctx.survey.getSurveysById.invalidate();
    },
  });

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
    let invalidForm = false;
    question.forEach((q) => {
      if (q["description"] === "" || q["type"] === "") {
        invalidForm = true;
        return;
      }
    });
    if (survey["title"] === "" || question.length === 0 || invalidForm) {
      topDivRef.current?.scrollTo(0, 0);
      setToastInfo({ message: "Invalid form", type: "alert-error" });
      setShowToast(true);
      return;
    }

    mutate({ survey, id: sessionData?.user.id });
  };

  return (
    <div
      className="hide flex h-full flex-col overflow-y-auto py-10 text-info-content"
      ref={topDivRef}
    >
      {showToast && (
        <Toast
          message={toastInfo["message"]}
          type={toastInfo["type"]}
          setShowToast={setShowToast}
        />
      )}
      <h1 className="color mb-4 text-4xl ">Create Survey</h1>
      {question.length <= 0 && (
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
      )}
      {question.length > 0 && (
        <div>
          <div className="mb-9 flex max-w-2xl flex-col gap-2 rounded-lg border border-base-300 p-3 shadow-sm">
            <label htmlFor="survey name" className=" label-text label text-2xl">
              Survey Name
            </label>
            <input
              className="input-bordered input input-sm w-full "
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
          <div className="mb-5 flex items-center gap-2">
            <MdAddBox
              size={33}
              style={{ cursor: "pointer" }}
              onClick={handleAddQuestion}
            />
            <p className="text-md">Add question</p>
          </div>
        </div>
      )}
      <button
        className="btn-secondary btn mt-auto max-w-[150px]"
        onClick={handleSubmitSurvey}
        disabled={isLoading}
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
