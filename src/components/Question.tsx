import React from "react";

import type { QuestionType } from "~/pages/dash";
import type { FC } from "react";

interface QuestionProps {
  question: QuestionType;
  handleUpdateQuestion: (id: string, question: QuestionType) => void;
}

const Question: FC<QuestionProps> = ({ question, handleUpdateQuestion }) => {
  const { id } = question;

  const questionType = ["input", "dropdown"];

  // const handleUpdateQuestionType = () => {

  // }

  return (
    <div>
      <select
        className="primary select w-full max-w-xs"
        defaultValue={"DEFAULT"}
        onChange={(e) =>
          handleUpdateQuestion(id, { ...question, type: e.target.value })
        }
      >
        <option disabled value="DEFAULT">
          Choose the type of question
        </option>
        {questionType.map((q, index) => (
          <option key={index} value={q}>
            {q}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Question;
