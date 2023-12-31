import { useState } from "react";
import { updateBio } from "@util/database";

import Blur from "./Blur";
import Loading from "./Loading";

interface Props {
  bio: string;
}

export default function EditBio({ bio }: Props) {
  const [attempted, setAttempted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [formInfo, setFormInfo] = useState({
    bio,
    valid: true,
  });
  const [loading, setLoading] = useState(false);

  const edit = () => {
    setEditing(true);
    setFormInfo({
      bio,
      valid: true,
    });
    setAttempted(false);
    setError(null);
  };

  const cancel = () => {
    setEditing(false);
    setFormInfo({
      bio,
      valid: true,
    });
    setAttempted(false);
    setError(null);
  };

  const changeBio = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLTextAreaElement;
    setFormInfo({
      bio: target.value,
      valid: target.validity.valid,
    });
  };

  const submit = async () => {
    setAttempted(true);
    if (formInfo.bio && formInfo.valid) {
      setLoading(true);
      try {
        await updateBio(formInfo.bio);
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

  return (
    <>
      {editing ? <Blur /> : null}
      <div
        // XXX
        // remove ternary?
        className={`${
          editing ? null : "-translate-y-[100%]"
        } absolute left-0 top-0 z-30 flex h-full w-full items-start  justify-center transition-transform`}
      >
        <div className="fixed w-full max-w-[420px] rounded bg-white p-3 text-xl shadow-xl">
          <h3 className="text-2xl">Edit Bio</h3>
          {loading ? (
            <Loading />
          ) : (
            <form className="flex flex-col items-start gap-2">
              <label htmlFor="bio">Bio:</label>
              <textarea
                className="w-full resize-none rounded border-2 border-black p-1"
                id="bio"
                onChange={changeBio}
                required
                rows={16}
                value={formInfo.bio || ""}
              />
              {attempted && !formInfo.valid ? (
                <div className="bg-red-300 p-1">Bio text required</div>
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
            </form>
          )}
        </div>
      </div>
      <button
        className="rounded border-2 border-black bg-neutral-300 p-1"
        onClick={edit}
        type="button"
      >
        Edit Bio
      </button>
    </>
  );
}
