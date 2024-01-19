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
      <div className="w-full aspect-video">
        <iframe
          className="h-full w-full border-2 border-brand-red p-1"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title="YouTube video player"
          allowFullScreen
        />
      </div>
    </div>
  );
}
