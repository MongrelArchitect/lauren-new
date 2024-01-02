import Art from "@customTypes/art";
import EditArt from "./EditArt";
import Modal from "./Modal";

interface Props {
  artDetail: null | Art;
  editingArt: boolean;
  closeArtDetail: () => void;
}

export default function ArtDetail({
  artDetail,
  editingArt,
  closeArtDetail,
}: Props) {
  if (artDetail) {
    if (editingArt) {
      // EDITING
      // ======================
      return (
        <Modal visible>
          <EditArt artDetail={artDetail} closeArtDetail={closeArtDetail} />
        </Modal>
      );
    }
    return (
      // VIEWING ONLY
      // ======================
      <Modal visible>
        <h3 className="text-2xl">{artDetail.title.toUpperCase()}</h3>
        <img
          alt={artDetail.title}
          src={artDetail.imageURL ? artDetail.imageURL : ""}
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
