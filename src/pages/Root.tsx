import { Outlet } from "react-router-dom";

import Footer from "@components/Footer";
import Nav from "@components/Nav";

export default function Root() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center bg-brand-canvas text-brand-black">
      <div className="relative flex h-full w-full max-w-[1000px] flex-col items-center bg-red-300 shadow-sides">
        <Nav />
        <main className="flex h-full w-full max-w-[1000px] flex-col items-center bg-brand-white p-2">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
