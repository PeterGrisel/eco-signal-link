import { ReactNode } from "react";

interface SignaalLayoutProps {
  children: ReactNode;
  className?: string;
}

const SignaalLayout = ({ children, className = "" }: SignaalLayoutProps) => {
  return (
    <div className={`signaal-theme min-h-screen bg-[#0A0A0B] text-[#F0F0EE] ${className}`}>
      {children}
    </div>
  );
};

export default SignaalLayout;
