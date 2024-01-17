import { Outlet } from "react-router-dom";

import Footer from "@components/Footer";
import Nav from "@components/Nav";

export default function Root() {
  return (
    <div className="relative flex min-h-[100svh] flex-col items-center">
      <Nav />
      <main className="flex w-full max-w-[1000px] flex-col items-center p-2">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
