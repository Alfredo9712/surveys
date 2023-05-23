import React, { useEffect, useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../server/auth";
import { MdAddBox } from "react-icons/md";
import { RouterOutputs, api } from "~/utils/api";
import { useSession } from "next-auth/react";

import type { GetServerSidePropsContext } from "next";
import Question from "~/components/Question";

export interface QuestionType {
  id: string;
  type: string;
  question: string;
}

const Dash = () => {
  const { data: sessionData } = useSession();

  //RouterOutputs to get type of the surveys

  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { type: "", id: self.crypto.randomUUID(), question: "" },
    ]);
  };

  return (
    <div className="flex h-full flex-col">
      <h1 className="mb-2 text-2xl">Create Survey</h1>
      <div className="mb-5">
        <p className="mb-1 text-sm">
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
          <Question key={question.id} {...question} />
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
