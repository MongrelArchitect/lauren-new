import { useState } from "react";
import { deleteVideo } from "@util/database";
import Loading from "./Loading";
import Modal from "./Modal";

interface Props {
  videoId: string;
  youtubeId: string;
}

export default function DeleteVideo({ videoId, youtubeId }: Props) {
  const [attempted, setAttempted] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const toggleConfirming = () => {
    setConfirmingDelete(!confirmingDelete);
  };

  const cancel = () => {
    setAttempted(false);
    setError(null);
    toggleConfirming();
  };

  const confirmDelete = async () => {
    setAttempted(true);
    setLoading(true);
    try {
      await deleteVideo(videoId);
      cancel();
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

  const displayForm = () => {
    return (
      <Modal close={cancel} visible={confirmingDelete}>
        <form className="flex flex-col items-start gap-2">
          <h3 className="text-2xl">Delete Video</h3>
          {loading ? (
            <Loading />
          ) : (
            <>
              {confirmingDelete ? (
                <iframe
                  className="h-[315px] w-full max-w-[560px] border-[1px] border-red-600 p-1"
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                  title="YouTube video player"
                  allowFullScreen
                />
              ) : null}
              <div className="flex w-full flex-col gap-2">
                <div className="bg-red-300 p-1">Confirm Delete</div>
                <div className="p-1 text-red-800">
                  Are you sure? This cannot be undone!
                </div>
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
      {displayForm()}
      <button
        className="rounded border-2 border-black bg-neutral-300 p-1"
        onClick={toggleConfirming}
      >
        Delete
      </button>
    </>
  );
}
