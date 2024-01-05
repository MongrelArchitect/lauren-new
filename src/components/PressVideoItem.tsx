interface Props {
  videoURL: string;
}

export default function PressVideoItem({ videoURL }: Props) {
  const youtubeId = videoURL.split("?v=")[1];

  return (
    <iframe
      className="h-[315px] w-full max-w-[560px] p-1 border-[1px] border-red-600"
      src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
      title="YouTube video player"
      frameBorder="0"
      allowFullScreen
    />
  );
}
