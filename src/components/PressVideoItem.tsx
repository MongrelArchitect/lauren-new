interface Props {
  videoURL: string;
}

export default function PressVideoItem({ videoURL }: Props) {
  const youtubeId = videoURL.split("?v=")[1];
  console.log(youtubeId);

  return (
    <iframe
      className="h-[315px] w-full max-w-[560px] p-1 border-[1px] border-red-600"
      src={`https://www.youtube.com/embed/${youtubeId}`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  );
}
