import { Outlet } from "react-router-dom";

import Footer from "@components/Footer";
import Nav from "@components/Nav";

export default function Root() {
  return (
    <div className="text-brand-black relative flex flex-col items-center min-h-[100svh] bg-brand-canvas">
      <div className="shadow-sides max-w-[1000px] w-full bg-red-300 relative flex flex-col h-full items-center">
        <Nav />
        <main className="flex w-full max-w-[1000px] flex-col items-center bg-brand-white p-2 h-full">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
