import { useState } from "react";
import PressVideo from "@customTypes/pressVideos";
import { addNewVideo } from "@util/database";
import Loading from "./Loading";
import Modal from "./Modal";

export default function NewVideo() {
  const defaultUrl = {
    value: "",
    valid: false,
  };
  const [adding, setAdding] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(defaultUrl);

  const toggleAdding = () => {
    setAdding(!adding);
  };

  const checkValidUrl = (value: string) => {
    return value.includes("youtube") || value.includes("youtu.be");
  };

  const changeURL = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    setUrl({
      value: target.value,
      valid: target.validity.valid && checkValidUrl(target.value),
    });
  };

  const submit = async () => {
    setAttempted(true);
    if (url.value && url.valid) {
      setLoading(true);
      try {
        const newVideo: PressVideo = {
          added: new Date(),
          url: url.value,
        };
        await addNewVideo(newVideo);
        setLoading(false);
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
    }
  };

  const cancel = () => {
    setAttempted(false);
    setError(null);
    setUrl(defaultUrl);
    toggleAdding();
  };

  const displayForm = () => {
    return (
      <Modal close={cancel} visible={adding}>
        <form className="flex flex-col items-start gap-2">
          <h3 className="text-2xl">New Video</h3>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div>Only YouTube is currently supported</div>
              <label htmlFor="url">YouTube URL</label>
              <input
                className="w-full rounded border-2 border-gray-500 p-1"
                type="url"
                id="url"
                onChange={changeURL}
                placeholder="ex: https://www.youtube.com/watch?v=ZLOSH5FUnrM"
                required
                value={url.value || ""}
              />
              {attempted && !url.valid ? (
                <div className="bg-red-300 p-1">YouTube URL required</div>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded border-2 border-gray-500 bg-green-300 p-1 hover:border-black"
                  onClick={submit}
                  type="button"
                >
                  Submit
                </button>
                <button
                  className="rounded border-2 border-gray-500 bg-red-300 p-1 hover:border-black"
                  onClick={cancel}
                  type="button"
                >
                  Cancel
                </button>
              </div>
              {attempted && error ? (
                <div className="bg-red-300 p-1">{error}</div>
              ) : null}
            </>
          )}
        </form>
      </Modal>
    );
  };

  return (
    <div>
      {displayForm()}
      <button
        className="rounded border-2 border-black bg-neutral-300 p-1"
        onClick={toggleAdding}
        type="button"
      >
        + New Video
      </button>
    </div>
  );
}
