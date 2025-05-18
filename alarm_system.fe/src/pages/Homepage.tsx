import * as React from "react";
import { useUserStore } from "../providers";
import { AdminHomepage } from "./AdminHomepage";
import { UserHomepage } from "./UserHomepage";

export const Homepage: React.FC = () => {
  const role = useUserStore((state) => state.userData?.role);

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
