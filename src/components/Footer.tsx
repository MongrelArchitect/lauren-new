import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "@contexts/users";

export default function Footer() {
  const user = useContext(UserContext);

  return (
    <footer className="mt-auto flex w-full max-w-[1000px] items-center justify-between border-t-2 border-active bg-white p-2">
      <div>
        <div>
          © {new Date().getFullYear()} Lauren Mendelsohn-Bass | All rights
          reserved
        </div>
        <div>
          Designed by{" "}
          <Link
            className="text-active hover:underline"
            target="_blank"
            to="https://seanericthomas.com"
          >
            Sean Eric Thomas
          </Link>
        </div>
      </div>
      <div>
        <Link
          className="text-xl text-active hover:underline"
          to={user ? "/dashboard" : "/login"}
        >
          {user ? "Dashboard" : "Login"}
        </Link>
      </div>
    </footer>
  );
}
