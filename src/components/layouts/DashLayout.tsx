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
      {children}
    </div>
  );
};

export default DashLayout;
