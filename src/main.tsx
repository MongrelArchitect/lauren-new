import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import CollectionsContextProvider from "@contexts/collections";

import ErrorPage from "@pages/ErrorPage";
import Home from "@pages/Home";
import Root from "@pages/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CollectionsContextProvider>
        <Root />
      </CollectionsContextProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
