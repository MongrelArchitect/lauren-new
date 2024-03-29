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
    <div className="flex justify-between gap-2 w-full bg-brand-gray">
      {prev ? (
        <button
          aria-label="Previous art in collection"
          id="prev"
          className="relative bottom-0 left-0 bg-brand-red hover:outline hover:outline-brand-black"
          data-direction="prev"
          onClick={handleClick}
          title="Previous"
          type="button"
        >
          <img
            alt=""
            className="h-[40px] invert"
            data-direction="prev"
            src={prevIcon}
          />
        </button>
      ) : (
        <div />
      )}
      {next ? (
        <button
          aria-label="Next art in collection"
          id="next"
          className="relative bottom-0 right-0 bg-brand-red hover:outline hover:outline-brand-black"
          data-direction="next"
          onClick={handleClick}
          title="Next"
          type="button"
        >
          <img
            alt=""
            className="h-[40px] invert"
            data-direction="next"
            src={nextIcon}
          />
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}
