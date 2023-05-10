import React from "react";
import Link from "next/link";

const SideNavbar = () => {
  return (
    <div className="flex h-screen w-32 flex-col items-center  bg-base-200 p-3">
      <Link href={"/dash"}>home</Link>
      <Link href={"/dash"}></Link>
    </div>
  );
};

export default SideNavbar;
