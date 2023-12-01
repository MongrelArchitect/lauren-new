import { useContext } from "react";
import { CollectionsContext } from "@contexts/collections";

interface Props {
  collectionId: string | undefined;
  modalVisible: boolean;
  toggleModalVisible: () => void;
}

export default function NewArt({
  collectionId,
  modalVisible,
  toggleModalVisible,
}: Props) {
  const allCollections = useContext(CollectionsContext);

  const currentCollection =
    allCollections && collectionId ? allCollections[collectionId] : null;

  if (currentCollection) {
    return (
      <div
        className={`${
          modalVisible ? null : "-translate-y-[110%]"
        } absolute left-0 top-0 flex h-full w-full items-start justify-center transition-transform`}
      >
        <div className="my-[100px] w-full max-w-[320px] rounded bg-white p-3 text-xl shadow-xl">
          <h3 className="text-2xl">New Art</h3>
          <p>{`Adding to collection "${currentCollection.name.toUpperCase()}"`}</p>
          <form className="flex flex-col items-start gap-2">
            <label htmlFor="name">Title:</label>
            <input
              className="w-full rounded border-2 border-gray-500 p-1"
              id="title"
              placeholder="ex: Untitled"
              required
              type="text"
            />
            <label htmlFor="medium">Medium:</label>
            <input
              className="w-full rounded border-2 border-gray-500 p-1"
              id="medium"
              placeholder="ex: Oil on canvas"
              required
              type="text"
            />
            <label htmlFor="medium">Size:</label>
            <input
              className="w-full rounded border-2 border-gray-500 p-1"
              id="size"
              placeholder={`ex: 36" x 24"`}
              required
              type="text"
            />
            <label htmlFor="sold">Sold:</label>
            <input
              className="h-6 w-6"
              id="sold"
              type="checkbox"
            />
            <label htmlFor="image">Image:</label>
            <input
              className="w-full rounded border-2 border-gray-500 p-1"
              id="image"
              required
              type="file"
            />
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded border-2 border-gray-500 bg-green-300 p-1 hover:border-black"
                type="button"
              >
                Submit
              </button>
              <button
                className="rounded border-2 border-gray-500 bg-red-300 p-1 hover:border-black"
                onClick={toggleModalVisible}
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        modalVisible ? null : "-translate-y-[110%]"
      } absolute left-0 top-0 flex h-full w-full items-start justify-center transition-transform`}
    >
      <div className="my-[100px] w-full max-w-[320px] rounded bg-white p-3 text-xl shadow-xl">
        <h3 className="text-2xl">Error</h3>
        <p>Invalid collection</p>
        <button
          className="rounded border-2 border-gray-500 bg-red-300 p-1 hover:border-black"
          onClick={toggleModalVisible}
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
