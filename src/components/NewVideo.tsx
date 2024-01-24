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
          <h3 className="w-full bg-brand-red p-2 text-2xl text-brand-white">
            New Video
          </h3>
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center self-center p-4">
              <Loading />
            </div>
          ) : (
            <div className="flex w-full flex-col items-start gap-2 p-2">
              <i>Note: only YouTube is currently supported.</i>
              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between">
                  <label htmlFor="url">YouTube URL</label>
                  {attempted && !url.valid ? (
                    <div className="text-brand-red">YouTube URL required</div>
                  ) : null}
                </div>
                <input
                  className={`${
                    attempted
                      ? "invalid:border-brand-red invalid:text-brand-red invalid:outline invalid:outline-brand-red invalid:focus:border-brand-red focus:invalid:outline-brand-red"
                      : null
                  } w-full border-2 border-black p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue`}
                  type="url"
                  id="url"
                  onChange={changeURL}
                  placeholder="ex: https://www.youtube.com/watch?v=ZLOSH5FUnrM"
                  required
                  value={url.value || ""}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="border-2 border-brand-black bg-brand-blue p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
                  onClick={submit}
                  type="button"
                >
                  Submit
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
          )}
        </form>
      </Modal>
    );
  };

  return (
    <>
      {displayForm()}
      <button
        className="mb-2 border-2 border-brand-black bg-brand-blue p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
        onClick={toggleAdding}
        type="button"
      >
        + New Video
      </button>
    </>
  );
}
