import DeleteVideo from "./DeleteVideo";

interface Props {
  inDashboard: boolean;
  videoId: string;
  videoURL: string;
}

export default function PressVideoItem({
  inDashboard,
  videoId,
  videoURL,
}: Props) {
  // accounting for two different youtube url types (youtube.com or youtu.be)
  const youtubeId = videoURL.includes("youtu.be")
    ? videoURL.split("?si=")[0].split("be/")[1]
    : videoURL.split("?v=")[1];

  return (
    <div className="flex items-center gap-2">
      {inDashboard ? (
        <DeleteVideo videoId={videoId} youtubeId={youtubeId} />
      ) : null}
      <iframe
        className="h-[315px] w-full max-w-[560px] border-[1px] border-red-600 p-1"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title="YouTube video player"
        allowFullScreen
      />
    </div>
  );
}
