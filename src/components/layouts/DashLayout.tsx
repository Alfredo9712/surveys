import React from "react";
import SideNavbar from "../SideNavbar";

import type { FC } from "react";

interface DashLayoutProps {
  children: React.ReactNode;
}

const DashLayout: FC<DashLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <SideNavbar />
      <div className="w-screen bg-slate-600 pt-3">{children}</div>
    </div>
  );
};

export default DashLayout;
