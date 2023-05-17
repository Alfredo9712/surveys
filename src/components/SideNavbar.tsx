import React from "react";

import { RiHome2Fill, RiSurveyFill } from "react-icons/ri";

import Link from "next/link";

const SideNavbar = () => {
  return (
    <div className="s flex h-screen w-32 flex-col items-center gap-9 bg-base-200 p-3 pt-10">
      <Link href={"/dash"}>
        <RiHome2Fill size={25} />
      </Link>
      <Link href={"/dash/surveys"}>
        <RiSurveyFill size={25} />
      </Link>
    </div>
  );
};

export default SideNavbar;
