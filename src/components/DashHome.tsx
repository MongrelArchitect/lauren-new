import { useContext } from "react";
import { UserContext } from "@contexts/users";

export default function DashHome() {
  const user = useContext(UserContext);

  return (
    <div className="h-full">
      <h2 className="text-2xl">Welcome {user ? user.name : null}!</h2>
      <p>Choose a menu item to get started.</p>
    </div>
  );
}
