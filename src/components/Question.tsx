import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";

import type { QuestionType } from "~/pages/dash";
import type { FC } from "react";

interface QuestionProps {
  question: QuestionType;
  handleUpdateQuestion: (id: string, question: QuestionType) => void;
  handleDeleteQuestion: (id: string) => void;
}

const Question: FC<QuestionProps> = ({
  question,
  handleUpdateQuestion,
  handleDeleteQuestion,
}) => {
  const { id } = question;

  const questionType = [
    { display: "Input", formValue: "input" },
    { display: "Dropdown", formValue: "Dropdown" },
    { display: "Text Area", formValue: "textArea" },
  ];

  return (
    <div className="z-30 mb-9 flex max-w-2xl  justify-between rounded-lg border border-base-300 p-3 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="label-text label text-xl ">
            Question description
          </label>
          <input
            type="text"
            placeholder="Test"
            className="input-bordered input input-sm w-full max-w-xs"
            name="description"
            value={question["description"]}
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
      <div className="">
        <RiDeleteBin5Line
          size={20}
          className="cursor-pointer"
          onClick={() => handleDeleteQuestion(id)}
        />
      </div>
    </div>
  );
};

export default Question;
