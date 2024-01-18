import { Dispatch, SetStateAction } from "react";
import AdjacentArt from "@customTypes/adjacent";
import Art from "@customTypes/art";

import nextIcon from "@assets/icons/next.svg";
import prevIcon from "@assets/icons/prev.svg";

interface Props {
  adjacent: AdjacentArt;
  next: null | Art;
  prev: null | Art;
  setArtDetail: Dispatch<SetStateAction<Art | null>>;
}

export default function ArtNav({ adjacent, next, prev, setArtDetail }: Props) {
  const handleClick = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLButtonElement;
    const { direction } = target.dataset;
    switch (direction) {
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
        <button
          id="prev"
          className="absolute bottom-0 left-0 bg-brand-red hover:outline hover:outline-brand-red"
          data-direction="prev"
          onClick={handleClick}
          type="button"
        >
          <img
            alt="previous"
            className="h-[36px] invert"
            data-direction="prev"
            title="previous"
            src={prevIcon}
          />
        </button>
      ) : (
        <div />
      )}
      {next ? (
        <button
          id="next"
          className="absolute bottom-0 right-0 bg-brand-red hover:outline hover:outline-brand-red"
          data-direction="next"
          onClick={handleClick}
          type="button"
        >
          <img
            alt="next"
            className="h-[36px] invert"
            data-direction="next"
            title="next"
            src={nextIcon}
          />
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}
