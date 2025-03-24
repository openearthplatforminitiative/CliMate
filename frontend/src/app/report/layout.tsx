import { ReactNode } from "react";

interface ReportProps {
  children: ReactNode;
  params?: any;
}

const Report = ({ children, params }: ReportProps) => {
  return <div className="p-2">{children}</div>;
};

export default Report;
