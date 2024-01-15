import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addNewCollection } from "@util/database";
import Loading from "./Loading";
import Modal from "./Modal";

export default function NewCollection() {
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [name, setName] = useState({ value: "", valid: false });

  const toggleNewCollection = () => {
    setModalVisible(!modalVisible);
  };

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

  const navigate = useNavigate();

  const submit = async () => {
    setAttempted(true);
    setLoading(true);
    if (name.valid) {
      try {
        const newCollectionId = await addNewCollection(name.value);
        cancel();
        navigate(`/dashboard/art/${newCollectionId}`);
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
    } else {
      setError("Name required");
    }
    setLoading(false);
  };

  return (
    <>
      <button
        className="rounded border-2 border-gray-800 bg-purple-300 p-1"
        onClick={toggleNewCollection}
        type="button"
      >
        + New Collection
      </button>
      <Modal close={cancel} visible={modalVisible}>
        <form className="flex flex-col items-start gap-2">
          <h3 className="text-2xl">New Collection</h3>
          {loading ? (
            <Loading />
          ) : (
            <>
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
            </>
          )}
        </form>
      </Modal>
    </>
  );
}
