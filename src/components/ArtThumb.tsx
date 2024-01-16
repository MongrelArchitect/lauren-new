import { Dispatch, SetStateAction, useState } from "react";
import Art from "@customTypes/art";
import Loading from "./Loading";

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
  const [loading, setLoading] = useState(true);

  const handleClick = () => {
    if (inDashboard) {
      setEditingArt(true);
    }
    setArtDetail(art);
  };

  return (
    <>
      <button
        className="relative z-10 h-[200px] w-[200px] border-2 border-red-400"
        onClick={handleClick}
        type="button"
      >
        {loading ? <Loading overlay /> : null}
        <img
          alt={art.title}
          onLoad={() => {
            setLoading(false);
          }}
          src={art.thumbURL ? art.thumbURL : ""}
        />
        {art.sold ? (
          <div className="absolute bottom-0 z-0 w-full bg-gray-800 bg-opacity-60 text-2xl text-neutral-50">
            SOLD
          </div>
        ) : null}
      </button>
    </>
  );
}
