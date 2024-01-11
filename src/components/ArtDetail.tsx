import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Art from "@customTypes/art";
import ArtNav from "./ArtNav";
import EditArt from "./EditArt";
import Loading from "./Loading";
import Modal from "./Modal";

import AdjacentArt from "@customTypes/adjacent";

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
        <Modal visible>
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
      <Modal visible>
        {loading ? <Loading overlay /> : null}
        <h3 className="text-2xl">{artDetail.title.toUpperCase()}</h3>
        <img
          alt={artDetail.title}
          src={artDetail.imageURL ? artDetail.imageURL : ""}
          onLoad={() => {
            setLoading(false);
          }}
        />
        <p>{artDetail.medium.toUpperCase()}</p>
        <p>{artDetail.size.toUpperCase()}</p>
        {artDetail.sold ? <p className="text-red-600">SOLD</p> : null}
        <button
          className="rounded border-2 border-gray-500 bg-red-300 p-1 hover:border-black"
          onClick={closeArtDetail}
          type="button"
        >
          Close
        </button>
        <ArtNav
          adjacent={adjacent}
          next={adjacent.next}
          prev={adjacent.prev}
          setArtDetail={setArtDetail}
        />
      </Modal>
    );
  }

  return (
    // NO ART DETAIL SELECTED
    // =========================
    // This modal won't show, but needs to be here for other animations to work.
    // Keep the "error" message just in case it shows up shomehow?
    <Modal visible={false}>
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
