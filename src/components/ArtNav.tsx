import { Dispatch, SetStateAction } from "react";
import AdjacentArt from "@customTypes/adjacent";
import Art from "@customTypes/art";

interface Props {
  adjacent: AdjacentArt;
  next: null | Art;
  prev: null | Art;
  setArtDetail: Dispatch<SetStateAction<Art | null>>;
}

export default function ArtNav({
  adjacent,
  next,
  prev,
  setArtDetail,
}: Props) {
  const handleClick = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLButtonElement;
    const { id } = target;
    switch (id) {
      case "next":
        setArtDetail(adjacent.next);
        break;
      case "prev":
        setArtDetail(adjacent.prev);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex justify-between gap-2">
      {prev ? (
        <button id="prev" onClick={handleClick} type="button">
          PREV
        </button>
      ) : (
        <div />
      )}
      {next ? (
        <button id="next" onClick={handleClick} type="button">
          NEXT
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}
