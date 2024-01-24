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
          <h3 className="w-full bg-brand-red p-2 text-2xl text-brand-white">
            Delete Video
          </h3>
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center self-center p-4">
              <Loading />
            </div>
          ) : (
            <div className="flex w-full flex-col items-start gap-2 p-2">
              {confirmingDelete ? (
                <div className="aspect-video w-full">
                  <iframe
                    className="h-full w-full border-2 border-brand-red p-1"
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                    title="YouTube video player"
                    allowFullScreen
                  />
                </div>
              ) : null}
              <div className="flex w-full flex-col gap-2">
                <div className="bg-brand-orange p-2 text-brand-white">
                  Confirm Delete
                </div>
                <div className="text-brand-red">
                  Are you sure? This cannot be undone!
                </div>
                <div className="flex gap-2">
                  <button
                    className="border-2 border-brand-black bg-brand-red p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
                    onClick={confirmDelete}
                    type="button"
                  >
                    Delete
                  </button>
                  <button
                    className="border-2 border-brand-black bg-brand-yellow p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
                    onClick={cancel}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
                {attempted && error ? (
                  <div className="w-full bg-brand-red p-2 text-brand-white">
                    {error}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </form>
      </Modal>
    );
  };

  return (
    <>
      {displayForm()}
      <button
        className="border-2 border-brand-black bg-brand-orange p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
        onClick={toggleConfirming}
      >
        Delete
      </button>
    </>
  );
}
