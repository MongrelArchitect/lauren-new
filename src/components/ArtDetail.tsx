import { Dispatch, SetStateAction, useEffect, useState } from "react";

import ArtNav from "./ArtNav";
import EditArt from "./EditArt";
import Loading from "./Loading";
import Modal from "./Modal";

import AdjacentArt from "@customTypes/adjacent";
import Art from "@customTypes/art";

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
        <div className="relative flex min-h-[640px] flex-col items-center gap-2">
          <div className="flex w-full items-center justify-between gap-3 bg-brand-red text-brand-white">
            <button
              className="flex-shrink-0 bg-brand-red hover:bg-brand-dark-gray"
              onClick={closeArtDetail}
              type="button"
            >
              <img
                alt="close"
                className="h-[40px] invert"
                title="close"
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

          <img
            className="max-h-[500px] border-2 border-brand-red p-1"
            alt={artDetail.title}
            src={artDetail.imageURL ? artDetail.imageURL : ""}
            onLoad={() => {
              setLoading(false);
            }}
          />

          <div className="text-center">
            <p>{artDetail.medium.toUpperCase()}</p>
            <p>{artDetail.size.toUpperCase()}</p>
            {artDetail.sold ? <p className="text-brand-red">SOLD</p> : null}
          </div>

          <ArtNav
            adjacent={adjacent}
            next={adjacent.next}
            prev={adjacent.prev}
            setArtDetail={setArtDetail}
          />
        </div>
      </Modal>
    );
  }

  return (
    // NO ART DETAIL SELECTED
    // =========================
    // This modal won't show, but needs to be here for other animations to work.
    // Keep the "error" message just in case it shows up shomehow?
    <Modal close={closeArtDetail} visible={false}>
      <h3 className="text-2xl">Error</h3>
      <p>Invalid artwork</p>
      <button
        className="rounded border-2 border-gray-500 bg-red-300 p-1 hover:border-black"
        onClick={closeArtDetail}
        type="button"
      >
        Cancel
      </button>
    </Modal>
  );
}
