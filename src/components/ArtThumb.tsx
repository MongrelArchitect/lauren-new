import { Dispatch, SetStateAction } from "react";
import Art from "@customTypes/art";

interface Props {
  art: Art;
  inDashboard: boolean;
  setArtDetail: Dispatch<SetStateAction<Art | null>>;
  setEditingArt: Dispatch<SetStateAction<boolean>>;
}

export default function ShowArt({
  art,
  inDashboard,
  setArtDetail,
  setEditingArt,
}: Props) {
  const handleClick = () => {
    if (inDashboard) {
      setEditingArt(true);
    }
    setArtDetail(art);
  };

  return (
    <>
      <button
        className="man-w-[200px] relative z-10 h-full w-full max-w-[200px]"
        onClick={handleClick}
        type="button"
      >
        <img alt={art.title} src={art.thumbURL ? art.thumbURL : ""} />
        {art.sold ? (
          <div className="absolute bottom-0 w-full bg-gray-800 bg-opacity-60 text-2xl text-neutral-50">
            SOLD
          </div>
        ) : null}
      </button>
    </>
  );
}
