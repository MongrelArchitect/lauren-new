import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { UserContext } from "@contexts/users";

import DashMenu from "@components/DashMenu";
import Login from "./Login";

export default function Dashboard() {
  useEffect(() => {
    document.title = "Lauren Mendelsohn-Bass | Dashboard";
  }, []);

  const user = useContext(UserContext);

  if (user) {
    return (
      <div className="flex h-full w-full flex-col gap-2">
        <h1 className="bg-brand-purple p-2 text-3xl text-brand-white">
          Dashboard
        </h1>
        <div className="grid h-full grid-rows-[auto_1fr] border-2 border-brand-red text-xl sm:grid-cols-[auto_1fr] sm:grid-rows-1">
          <DashMenu />
          <div className="p-2">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  return <Login />;
}
