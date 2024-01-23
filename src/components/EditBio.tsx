import { useState } from "react";
import { updateBio } from "@util/database";

import Loading from "./Loading";
import Modal from "./Modal";

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
      <Modal close={cancel} visible={editing}>
        <form>
          <h3 className="w-full bg-brand-red p-2 text-2xl text-brand-white">
            Edit Bio
          </h3>
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center self-center p-4">
              <Loading />
            </div>
          ) : (
            <div className="flex w-full flex-col items-start gap-2 p-2">
              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between">
                  <label htmlFor="bio">Bio</label>
                  {attempted && !formInfo.valid ? (
                    <div className="text-brand-red">Name required</div>
                  ) : null}
                </div>
                <textarea
                  className={`${
                    attempted
                      ? "invalid:border-brand-red invalid:text-brand-red invalid:outline invalid:outline-brand-red invalid:focus:border-brand-red focus:invalid:outline-brand-red"
                      : null
                  } w-full resize-none border-2 border-black p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue`}
                  id="bio"
                  onChange={changeBio}
                  required
                  rows={16}
                  value={formInfo.bio || ""}
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
                <div className="bg-red-300 p-1">{error}</div>
              ) : null}
            </div>
          )}
        </form>
      </Modal>
      <button
        className="border-2 border-brand-black bg-brand-blue p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
        onClick={edit}
        type="button"
      >
        Edit Bio
      </button>
    </>
  );
}
