import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@contexts/users";

import Dashboard from "./Dashboard";
import Login from "./Login";

export default function Protected() {
  const user = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate, user]);

  if (user) {
    return <Dashboard />;
  }

  return <Login />
}
