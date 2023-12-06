import Art from "@customTypes/art";
import EditArt from "./EditArt";

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
        <div
          // XXX - remove ternary 
          className={`${
            artDetail ? null : "-translate-y-[110%]"
          } absolute left-0 top-0 flex h-full w-full items-start justify-center transition-transform`}
        >
          <EditArt artDetail={artDetail} closeArtDetail={closeArtDetail} />
        </div>
      );
    }
    return (
      // VIEWING ONLY
      // ======================
      <div
          // XXX - remove ternary 
        className={`${
          artDetail ? null : "-translate-y-[110%]"
        } absolute left-0 top-0 flex h-full w-full items-start justify-center transition-transform`}
      >
        <div className="my-[100px] w-full max-w-[320px] rounded bg-white p-3 text-xl shadow-xl">
          <h3 className="text-2xl">{artDetail.title.toUpperCase()}</h3>
          <img alt={artDetail.title} src={artDetail.imageURL ? artDetail.imageURL : ''} />
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
        </div>
      </div>
    );
  }

  return (
    // INVALID ART SOMEHOW
    // =========================
    <div
      // XXX - remove ternary 
      className={`${
        artDetail ? null : "-translate-y-[110%]"
      } absolute left-0 top-0 flex h-full w-full items-start justify-center transition-transform`}
    >
      <div className="my-[100px] w-full max-w-[320px] rounded bg-white p-3 text-xl shadow-xl">
        <h3 className="text-2xl">Error</h3>
        <p>Invalid artwork</p>
        <button
          className="rounded border-2 border-gray-500 bg-red-300 p-1 hover:border-black"
          onClick={closeArtDetail}
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
