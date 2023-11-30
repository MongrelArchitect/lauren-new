import { Outlet } from "react-router-dom";

import Footer from "@components/Footer";
import Nav from "@components/Nav";

export default function Root() {
  return (
    <div className="flex min-h-[100svh] flex-col">
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
