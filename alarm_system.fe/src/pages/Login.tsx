import * as React from "react";
import { LoginForm } from "../components/ui/forms/LoginForm";

export const Login: React.FC = () => {
  return (
    <div className="grid h-screen place-items-center bg-gray-50">
      <div className="w-full max-w-md p-4 sm:p-8 bg-white sm:rounded-lg sm:shadow-md">
        <LoginForm />
      </div>
    </div>
  );
};
