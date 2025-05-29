import * as React from "react";
import { useUser } from "../providers";
import { AdminHomepage } from "./AdminHomepage";
import { UserHomepage } from "./UserHomepage";

export const Homepage: React.FC = () => {
  const { userData } = useUser();
  const role = userData?.role;

  return (
    <>
      {role === "user" ? (
        <UserHomepage />
      ) : role === "admin" ? (
        <AdminHomepage />
      ) : null}
    </>
  );
};
