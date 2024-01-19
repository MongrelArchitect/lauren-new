import { Outlet } from "react-router-dom";

import Footer from "@components/Footer";
import Nav from "@components/Nav";

export default function Root() {
  return (
    <div className="text-brand-black relative flex min-h-[100svh] flex-col items-center bg-brand-light-gray">
      <Nav />
      <main className="flex w-full max-w-[1000px] flex-col items-center bg-brand-white p-2 h-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
