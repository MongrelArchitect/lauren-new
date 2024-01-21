import { NavLink } from "react-router-dom";

export default function DashMenu() {
  return (
    <div className="flex h-full flex-col gap-2 border-brand-red bg-brand-gray text-2xl max-sm:border-b-2 sm:border-r-2">
      <h2 className="w-full bg-brand-dark-gray p-2 text-brand-white">Menu</h2>
      <ul className="flex flex-col gap-2 p-2">
        <NavLink
          className="hover:text-brand-red hover:underline"
          to="/dashboard/home"
        >
          HOME
        </NavLink>
        <NavLink
          className="hover:text-brand-red hover:underline"
          to="/dashboard/art"
        >
          ART
        </NavLink>
        <NavLink
          className="hover:text-brand-red hover:underline"
          to="/dashboard/profile"
        >
          PROFILE
        </NavLink>
        <NavLink
          className="hover:text-brand-red hover:underline"
          to="/dashboard/press"
        >
          PRESS
        </NavLink>
      </ul>
    </div>
  );
}
