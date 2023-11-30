import { useContext, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

import { UserContext } from "@contexts/users";

export default function Dashboard() {
  const user = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <main className="bg-green-200 grid grid-cols-[auto_1fr] gap-4">
      <div>
        Menu
      </div>
      <Outlet />
    </main>
  );
}
