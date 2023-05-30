import React, { useEffect, useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { MdAddBox } from "react-icons/md";

import type { GetServerSidePropsContext } from "next";
import Question from "~/components/Question";

export type DropdownType = "input" | "dropdown" | "textarea";

export interface QuestionType {
  id: string;
  type: string;
  description: string;
}

const Dash = () => {
  //RouterOutputs to get type of the surveys

  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const handleUpdateQuestion = (id: string, question: QuestionType) => {
    const updatedQuestion = questions.map((q) => (q.id === id ? question : q));
    setQuestions(updatedQuestion);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { type: "", id: self.crypto.randomUUID(), description: "" },
    ]);
  };

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  return (
    <div className="flex h-full flex-col">
      <h1 className="mb-2 text-2xl">Create Survey</h1>
      <div className="mb-5">
        <p className="mb-3 text-sm">
          Click below to add a question to your survey
        </p>
        <MdAddBox
          size={30}
          style={{ cursor: "pointer" }}
          onClick={handleAddQuestion}
        />
      </div>
      {questions &&
        questions.map((question) => (
          <Question
            key={question.id}
            question={question}
            handleUpdateQuestion={handleUpdateQuestion}
          />
        ))}
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
