import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import CollectionsContextProvider from "@contexts/collections";
import UserContextProvider from "@contexts/users";

import Contact from "@pages/Contact";
import ErrorPage from "@pages/ErrorPage";
import Gallery from "@pages/Gallery";
import Home from "@pages/Home";
import Protected from "@pages/Protected";
import NotFound from "@pages/NotFound";
import Press from "@pages/Press";
import Profile from "@pages/Profile";
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
        path: "art/:collectionId",
        element: <Gallery />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dashboard",
        element: <Protected />,
      },
      {
        path: "login",
        element: <Protected />,
      },
      {
        path: "press",
        element: <Press />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
