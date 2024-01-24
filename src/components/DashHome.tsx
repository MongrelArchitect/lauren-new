import { useContext } from "react";
import { UserContext } from "@contexts/users";

export default function DashHome() {
  const user = useContext(UserContext);

  return (
    <div className="flex h-full flex-col gap-2">
      <h2 className="w-full bg-brand-red p-2 text-3xl text-brand-white">
        Welcome {user ? user.name : null}!
      </h2>
      <p className="text-xl">
        Choose a section from the menu to view and edit its content.
      </p>
    </div>
  );
}
