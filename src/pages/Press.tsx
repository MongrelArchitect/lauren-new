import PressArticles from "@components/PressArticles";
import PressVideos from "@components/PressVideos";

export default function Press() {
  return (
    <div className="flex w-full flex-col gap-2">
      <PressVideos />
      <PressArticles />
    </div>
  );
}
