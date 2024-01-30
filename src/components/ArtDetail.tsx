import { Dispatch, SetStateAction, useEffect, useState } from "react";

import ArtNav from "./ArtNav";
import EditArt from "./EditArt";
import Loading from "./Loading";
import Modal from "./Modal";

import AdjacentArt from "@customTypes/adjacent";
import Art from "@customTypes/art";

import useSwipe from "@customHooks/useSwipe";

import closeIcon from "@assets/icons/close.svg";

interface Props {
  adjacent: AdjacentArt;
  artDetail: null | Art;
  editingArt: boolean;
  closeArtDetail: () => void;
  setArtDetail: Dispatch<SetStateAction<Art | null>>;
}

export default function ArtDetail({
  adjacent,
  artDetail,
  editingArt,
  closeArtDetail,
  setArtDetail,
}: Props) {
  const [loading, setLoading] = useState(true);

  const swipeHandlers = useSwipe({
    onSwipedLeft: () => {
      setArtDetail(adjacent.next);
    },
    onSwipedRight: () => {
      setArtDetail(adjacent.prev);
    },
  });

  useEffect(() => {
    setLoading(true);
  }, [artDetail]);

  if (artDetail) {
    if (editingArt) {
      // EDITING
      // ======================
      return (
        <Modal close={closeArtDetail} visible>
          <EditArt artDetail={artDetail} closeArtDetail={closeArtDetail}>
            <ArtNav
              adjacent={adjacent}
              next={adjacent.next}
              prev={adjacent.prev}
              setArtDetail={setArtDetail}
            />
          </EditArt>
        </Modal>
      );
    }

    return (
      // VIEWING ONLY
      // ======================
      <Modal close={closeArtDetail} visible>
        {loading ? <Loading overlay /> : null}
        <div
          {...swipeHandlers}
          className="relative flex min-h-[640px] flex-col items-center gap-2"
        >
          <div className="flex w-full items-center justify-between gap-3 bg-brand-gray text-brand-black">
            <button
              aria-label="Close art detail"
              className={`${
                artDetail ? "" : "hidden"
              } flex-shrink-0 self-start bg-brand-red hover:outline hover:outline-brand-black`}
              onClick={closeArtDetail}
              title="Close"
              type="button"
            >
              <img
                alt=""
                className="h-[40px] invert"
                src={closeIcon}
              />
            </button>
            <b>
              <h3 className="text-center text-2xl">
                {artDetail.title.toUpperCase()}
              </h3>
            </b>
            <div className="h-[40px] w-[40px] flex-shrink-0" />
          </div>

          <div className="flex flex-col items-center gap-2 p-2">
            <img
              className="max-h-[500px] border-2 border-brand-red p-1"
              alt={artDetail.title}
              src={artDetail.imageURL ? artDetail.imageURL : ""}
              onLoad={() => {
                setLoading(false);
              }}
            />

            <div className="text-center text-2xl">
              <p>{artDetail.medium}</p>
              <p>{artDetail.size}</p>
              {artDetail.sold ? <p className="text-brand-red">SOLD</p> : null}
            </div>
          </div>
        </div>
        {artDetail ? (
          <ArtNav
            adjacent={adjacent}
            next={adjacent.next}
            prev={adjacent.prev}
            setArtDetail={setArtDetail}
          />
        ) : null}
      </Modal>
    );
  }

  return (
    // NO ART DETAIL SELECTED
    // =========================
    // This modal won't show, but needs to be here for other animations to work.
    // Keep the "error" message just in case it shows up shomehow?
    <Modal close={closeArtDetail} visible={false}>
      <div className="invisible relative flex min-h-[640px] flex-col items-center gap-2">
        <h3 className="w-full bg-brand-red p-2 text-2xl text-brand-white">
          Error
        </h3>
        <div className="flex flex-col gap-2 p-2">
          <p className="text-brand-red">No Artwork Selected</p>
          <p>
            If you're seeing this message, either something really screwy
            happened or you're poking around in the code.
          </p>
          <p>
            This modal is here when artDetail is null, so that transition
            effects will work when opening or closing a piece of art. If we
            don't render it, the "art detail" modals will just pop in / out of
            existence (which doesn't look very nice).
          </p>
        </div>
      </div>
    </Modal>
  );
}
