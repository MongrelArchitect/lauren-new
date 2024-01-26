import { useState } from "react";

import Collection from "@customTypes/collections";
import Loading from "./Loading";
import Modal from "./Modal";

import { updateCollection } from "@util/database";

interface Props {
  collection: Collection;
}

export default function EditCollection({ collection }: Props) {
  const defaultName = ({
    value: collection.name,
    valid: true,
  });

  const [attempted, setAttempted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(defaultName);

  const toggleEditing = () => {
    setEditing(!editing);
    setName(defaultName);
  };

  const cancel = () => {
    toggleEditing();
    setAttempted(false);
    setError(null);
    setName(defaultName);
  };

  const changeName = (event: React.SyntheticEvent) => {
    setError(null);
    const target = event.target as HTMLInputElement;
    setName((prevState) => {
      return {
        ...prevState,
        valid: target.validity.valid,
        value: target.value,
      };
    });
  };

  const submit = async () => {
    setAttempted(true);
    setLoading(true);
    if (name.valid) {
      try {
        await updateCollection(collection.id, name.value);
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
    }
    setLoading(false);
  };

  const displayForm = () => {
    return (
      <Modal close={cancel} visible={editing}>
        <form>
          <h3 className="w-full bg-brand-red p-2 text-2xl text-brand-white">
            Rename Collection
          </h3>
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center self-center p-4">
              <Loading />
            </div>
          ) : (
            <div className="flex w-full flex-col items-start gap-2 p-2">
              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between">
                  <label htmlFor="name">Name</label>
                  {attempted && !name.valid ? (
                    <div className="text-brand-red">Name required</div>
                  ) : null}
                </div>
                <input
                  className={`${
                    attempted
                      ? "invalid:border-brand-red invalid:text-brand-red invalid:outline invalid:outline-brand-red invalid:focus:border-brand-red focus:invalid:outline-brand-red"
                      : null
                  } w-full border-2 border-black p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue`}
                  id="name"
                  onChange={changeName}
                  placeholder="ex: Awesome Art"
                  required
                  type="text"
                  value={name.value || ""}
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
      <button
        className="border-2 border-brand-black bg-brand-blue p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
        onClick={toggleEditing}
        type="button"
      >
        Rename
      </button>
      {displayForm()}
    </>
  );
}
