import * as React from "react";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export const Providers: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};
