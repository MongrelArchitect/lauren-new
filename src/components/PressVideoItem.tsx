interface Props {
  videoURL: string;
}

export default function PressVideoItem({ videoURL }: Props) {
  // accounting for two different youtube url types (youtube.com or youtu.be)
  const youtubeId = videoURL.includes("youtu.be")
    ? videoURL.split("?si=")[0].split("be/")[1]
    : videoURL.split("?v=")[1];

  return (
    <iframe
      className="h-[315px] w-full max-w-[560px] border-[1px] border-red-600 p-1"
      src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
      title="YouTube video player"
      frameBorder="0"
      allowFullScreen
    />
  );
}
