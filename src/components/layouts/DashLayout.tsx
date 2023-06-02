import React from "react";
import SideNavbar from "../SideNavbar";

import type { FC } from "react";

interface DashLayoutProps {
  children: React.ReactNode;
}

const DashLayout: FC<DashLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <SideNavbar />
      <div className="z-0 w-screen px-10">{children}</div>
    </div>
  );
};

export default DashLayout;
