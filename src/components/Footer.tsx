import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-orange-200 mt-auto">
      <Link to="/login">Login</Link>
    </footer>
  );
}
