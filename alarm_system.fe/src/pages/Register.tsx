import * as React from "react";
import { RegisterForm } from "../components/ui/forms/RegisterForm";

export const Register: React.FC = () => {
  return (
    <div className="grid h-screen place-items-center bg-gray-50">
      <div className="w-full max-w-md p-4 sm:p-8 bg-white sm:rounded-lg sm:shadow-md">
        <RegisterForm />
      </div>
    </div>
  );
};
