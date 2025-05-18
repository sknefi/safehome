import * as React from "react";
import { useLocation } from "react-router-dom";

interface PageLayoutProps {
  children: React.ReactNode;
}
export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const layoutStyles = "normal";

  const layoutStylesAuthPage = "auth";

  const { pathname } = useLocation();
  const isAuth = pathname === "/login" || pathname === "/register";

  return (
    <div className={isAuth ? layoutStylesAuthPage : layoutStyles}>
      {children}
    </div>
  );
};
