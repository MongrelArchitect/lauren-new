import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import CollectionsContextProvider from "@contexts/collections";
import UserContextProvider from "@contexts/users";

import ErrorPage from "@pages/ErrorPage";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Root from "@pages/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserContextProvider>
        <CollectionsContextProvider>
          <Root />
        </CollectionsContextProvider>
      </UserContextProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
