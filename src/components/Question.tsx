import React from "react";

import type { QuestionType } from "~/pages/dash";
import type { FC } from "react";

const Question: FC<QuestionType> = ({ type, question }) => {
  return (
    <div>
      <p>question</p>
      <select className="select w-full max-w-xs" defaultValue={"DEFAULT"}>
        <option disabled value="DEFAULT">
          Pick your favorite Simpson
        </option>
        <option>Homer</option>
        <option>Marge</option>
        <option>Bart</option>
        <option>Lisa</option>
        <option>Maggie</option>
      </select>
    </div>
  );
};

export default Question;
