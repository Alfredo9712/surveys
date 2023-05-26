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
    <div className="flex flex-col gap-5 rounded-lg border border-slate-300 p-3 shadow-xl">
      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="label-text label">
          Question description
        </label>
        <input
          type="text"
          placeholder="Test"
          className="input-bordered input input-sm w-full max-w-xs"
          name="description"
        />
      </div>
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
    </div>
  );
};

export default Question;
