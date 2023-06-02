import React from "react";
import { signOut, useSession } from "next-auth/react";
import { RiHome2Fill, RiSurveyFill, RiLogoutBoxRFill } from "react-icons/ri";
import Link from "next/link";

const SideNavbar = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="s flex w-32 flex-col items-center gap-9  border-r-2 p-3 pt-10">
      <Link href={"/dash"}>
        <RiHome2Fill size={25} color="hsl(var(--inc))" />
      </Link>
      <Link href={"/dash/surveys"}>
        <RiSurveyFill size={25} color="hsl(var(--inc))" />
      </Link>
      <RiLogoutBoxRFill
        size={25}
        onClick={sessionData ? () => void signOut() : () => null}
        style={{ cursor: "pointer" }}
        color="hsl(var(--inc))"
      />
    </div>
  );
};

export default SideNavbar;
