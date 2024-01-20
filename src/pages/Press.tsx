import { useEffect } from "react";

import PressArticles from "@components/PressArticles";
import PressVideos from "@components/PressVideos";

export default function Press() {
  useEffect(() => {
    document.title = 'Lauren Mendelsohn-Bass | Press';
  }, []);
  return (
    <div className="flex w-full flex-col gap-2">
      <PressVideos />
      <PressArticles />
    </div>
  );
}
