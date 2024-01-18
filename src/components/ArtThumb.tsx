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
        className="relative z-10 aspect-square max-h-[200px] min-h-[160px] min-w-[160px] max-w-[200px] border-[1px] border-brand-red p-1 hover:p-0 focus:p-0"
        onClick={handleClick}
        type="button"
      >
        {loading ? <Loading overlay /> : null}
        <img
          alt={art.title}
          className="h-full w-full"
          onLoad={() => {
            setLoading(false);
          }}
          src={art.thumbURL ? art.thumbURL : ""}
        />
        {art.sold ? (
          <div className="relative bottom-[32px] z-0 w-full bg-brand-red bg-opacity-60 text-2xl text-neutral-50">
            SOLD
          </div>
        ) : null}
      </button>
    </>
  );
}
