import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCollection } from "@util/database";
import Loading from "./Loading";
import Modal from "./Modal";
import Art from "@customTypes/art";
import Collection from "@customTypes/collections";

interface Artwork {
  [key: string]: Art;
}

interface Props {
  art: null | Artwork;
  artCount: number;
  collection: Collection;
}

export default function DeleteCollection({ art, artCount, collection }: Props) {
  const [attempted, setAttempted] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toggleConfirming = () => {
    setConfirming(!confirming);
  };

  const cancel = () => {
    toggleConfirming();
    setAttempted(false);
    setAcknowledged(false);
    setError(null);
  };

  const confirmDelete = async () => {
    setAttempted(true);
    setLoading(true);
    try {
      await deleteCollection(collection.id, art);
      cancel();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      let message = "Unknown error";
      if (err instanceof Error) {
        message = err.message;
      }
      if (typeof err === "string") {
        message = err;
      }
      setError(message);
    }
    setLoading(false);
  };

  const toggleAcknowledge = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      setAcknowledged(true);
    } else {
      setAcknowledged(false);
    }
  };

  const displayControls = () => {
    if (artCount) {
      return (
        <>
          <p>Please confirm below:</p>
          <div className="flex items-center gap-2">
            <input
              checked={acknowledged}
              className="h-6 w-6"
              id="acknowledge"
              onChange={toggleAcknowledge}
              type="checkbox"
            />
            <label htmlFor="acknowledge">
              Delete collection &amp; all its art
            </label>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded border-2 border-gray-500 bg-red-400 p-1 hover:border-black disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:border-gray-300"
              disabled={!acknowledged}
              onClick={confirmDelete}
              type="button"
            >
              Delete
            </button>
            <button
              className="rounded border-2 border-gray-500 bg-orange-300 p-1 hover:border-black"
              onClick={cancel}
              type="button"
            >
              Cancel
            </button>
          </div>
        </>
      );
    }
    return (
      <div className="flex gap-2">
        <button
          className="rounded border-2 border-gray-500 bg-red-400 p-1 hover:border-black"
          onClick={confirmDelete}
          type="button"
        >
          Delete
        </button>
        <button
          className="rounded border-2 border-gray-500 bg-orange-300 p-1 hover:border-black"
          onClick={cancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    );
  };

  const displayForm = () => {
    return (
      <Modal close={cancel} visible={confirming}>
        <form className="flex flex-col items-start gap-2">
          <h3 className="text-2xl">Delete Collection</h3>
          <p>Deleting collection "{collection.name}"</p>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className="flex w-full flex-col gap-2">
                {artCount ? (
                  <>
                    <div className="bg-red-300 p-1">WARNING</div>
                    <div className="flex flex-col gap-2 p-1 text-brand-red">
                      <p>
                        This collection contains artwork. Deleting the
                        collection will also delete{" "}
                        {artCount > 1
                          ? `all ${artCount} pieces of`
                          : "the 1 piece of"}{" "}
                        art within it.
                      </p>
                      <p>
                        <strong>This cannot be undone!</strong>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-red-300 p-1">Confirm Delete</div>
                    <div className="p-1 text-brand-red">
                      Are you sure? This cannot be undone!
                    </div>
                  </>
                )}

                {displayControls()}

                {attempted && error ? (
                  <div className="bg-red-300 p-1">{error}</div>
                ) : null}
              </div>
            </>
          )}
        </form>
      </Modal>
    );
  };

  return (
    <>
      <button
        className="bg-brand-orange p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
        onClick={toggleConfirming}
        type="button"
      >
        - Delete Collection
      </button>
      {displayForm()}
    </>
  );
}
