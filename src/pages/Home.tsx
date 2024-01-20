import { useEffect } from "react";
import HomeImage from "@components/HomeImage";

export default function Home() {
  useEffect(() => {
    document.title = 'Lauren Mendelsohn-Bass | Fine Art';
  }, []);

  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="bg-brand-red p-2 text-3xl text-brand-white">Fine Art</h1>
      <HomeImage />
    </div>
  );
}
