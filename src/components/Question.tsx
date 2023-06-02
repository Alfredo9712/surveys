import React from "react";

import type { QuestionType } from "~/pages/dash";
import type { FC } from "react";

interface QuestionProps {
  question: QuestionType;
  handleUpdateQuestion: (id: string, question: QuestionType) => void;
}

const Question: FC<QuestionProps> = ({ question, handleUpdateQuestion }) => {
  const { id } = question;

  const questionType = [
    { display: "Input", formValue: "input" },
    { display: "Dropdown", formValue: "Dropdown" },
    { display: "Text Area", formValue: "textArea" },
  ];

  return (
    <div className="z-30 mb-9 flex flex-col gap-5 rounded-lg border border-slate-300 p-4 shadow-sm ">
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="label-text label text-xl ">
          Question description
        </label>
        <input
          type="text"
          placeholder="Test"
          className="input-bordered input input-sm w-full max-w-xs"
          name="description"
          onChange={(e) =>
            handleUpdateQuestion(id, {
              ...question,
              description: e.target.value,
            })
          }
        />
      </div>
      <div>
        <select
          className=" select select-sm w-full max-w-xs "
          defaultValue={"DEFAULT"}
          onChange={(e) =>
            handleUpdateQuestion(id, { ...question, type: e.target.value })
          }
        >
          <option disabled value="DEFAULT">
            Choose the type of question
          </option>
          {questionType.map(({ display, formValue }, index) => (
            <option key={index} value={formValue}>
              {display}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Question;
