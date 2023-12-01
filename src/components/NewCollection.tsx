import { useState } from "react";
import { addNewCollection } from "@util/database";

interface Props {
  modalVisible: boolean;
  toggleNewCollection: () => void;
}

export default function NewCollection({
  modalVisible,
  toggleNewCollection,
}: Props) {
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [name, setName] = useState({ value: "", valid: false });

  const cancel = () => {
    toggleNewCollection();
    setAttempted(false);
    setError(null);
    setName({
      value: "",
      valid: false,
    });
  };

  const changeName = (event: React.SyntheticEvent) => {
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
    if (name.valid) {
      try {
        const newCollectionId = await addNewCollection(name.value);
        console.log(newCollectionId);
        cancel();
      } catch (err) {
        console.error(err);
        let message = 'Unknown error';
        if (err instanceof Error) {
          message = err.message;
        }
        if (typeof err === 'string') {
          message = err;
        }
        setError(message);
      }
    } else {
      setError("Name required");
    }
  };

  return (
    <div
      className={`${
        modalVisible ? null : "-translate-y-[110%]"
      } absolute left-0 top-0 flex h-full w-full items-start justify-center transition-transform`}
    >
      <div className="my-[100px] w-full max-w-[320px] rounded bg-white p-3 text-xl shadow-xl">
        <h3 className="text-2xl">New Collection</h3>
        <form className="flex flex-col items-start gap-2">
          <label htmlFor="name">Name:</label>
          <input
            className="w-full rounded border-2 border-gray-500 p-1"
            id="name"
            onChange={changeName}
            required
            type="text"
            value={name.value || ""}
          />
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
      </div>
    </div>
  );
}
