import * as React from "react";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";

import { PageWrapper } from "../components/layout";
import { RouteGuard } from "./RouteGuard";
import { Homepage, HouseholdDetail, Login, Register } from "../pages";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <PageWrapper />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "homepage",
        element: <Homepage />,
      },
      {
        path: "household-detail/:householdId",
        element: <HouseholdDetail />,
      },
    ],
  },
];
const router = createBrowserRouter(routes);

export const Router: React.FC = () => <RouterProvider router={router} />;

// ### add RouteGuard to Homepage and HouseholdDetail
