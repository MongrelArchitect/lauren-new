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
    }
    setLoading(false);
  };

  return (
    <>
      <button
        className="bg-brand-blue p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
        onClick={toggleNewCollection}
        type="button"
      >
        + New Collection
      </button>
      <Modal close={cancel} visible={modalVisible}>
        <form className="flex flex-col items-start gap-2">
          <h3 className="w-full bg-brand-red p-2 text-2xl text-brand-white">
            New Collection
          </h3>
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center self-center p-4">
              <Loading />
            </div>
          ) : (
            <div className="flex w-full flex-col items-start gap-2 p-2">
              <div className="flex w-full flex-col gap-1">
                  <div className="flex flex-wrap items-center justify-between">
                    <label htmlFor="name">Name:</label>
                    {attempted && !name.valid ? (
                      <div className="text-brand-red">
                        Name required
                      </div>
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
                  className="bg-brand-blue p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
                  onClick={submit}
                  type="button"
                >
                  Submit
                </button>
                <button
                  className="bg-brand-yellow p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
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
    </>
  );
}
