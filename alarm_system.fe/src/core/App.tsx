import * as React from "react";
import { Providers } from "./Providers.tsx";
import { Router } from "./Router.tsx";

export const App: React.FC = () => {
  return (
    <Providers>
      <Router />
    </Providers>
  );
};
