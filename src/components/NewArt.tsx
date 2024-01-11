import { useContext, useState } from "react";
import { CollectionsContext } from "@contexts/collections";
import { addNewArt } from "@util/database";
import { ArtFormInfo } from "@customTypes/art";
import Loading from "./Loading";
import Modal from "./Modal";

interface Props {
  collectionId: string | undefined;
}

export default function NewArt({ collectionId }: Props) {
  const [addingArt, setAddingArt] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const allCollections = useContext(CollectionsContext);

  const currentCollection =
    allCollections && collectionId ? allCollections[collectionId] : null;

  const [formInfo, setFormInfo] = useState<ArtFormInfo>({
    title: "",
    validTitle: false,
    medium: "",
    validMedium: false,
    size: "",
    validSize: false,
    sold: false,
    image: null,
    validImage: false,
  });

  const cancel = () => {
    toggleAddingArt();
    setFormInfo({
      title: "",
      validTitle: false,
      medium: "",
      validMedium: false,
      size: "",
      validSize: false,
      sold: false,
      image: null,
      validImage: false,
    });
    setError(null);
    setAttempted(false);
  };

  const checkFormValidity = () => {
    return (
      formInfo.validTitle &&
      formInfo.validMedium &&
      formInfo.validSize &&
      formInfo.validImage
    );
  };

  const checkImageValidity = (file: File | null) => {
    if (file && file.type.split("/")[0] === "image") {
      return true;
    }
    return false;
  };

  const handleChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const inputId = target.id;
    const file = target.files ? target.files[0] : null;
    setError(null);
    switch (inputId) {
      case "title":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            title: target.value,
            validTitle: target.validity.valid,
          };
        });
        break;
      case "medium":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            medium: target.value,
            validMedium: target.validity.valid,
          };
        });
        break;
      case "size":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            size: target.value,
            validSize: target.validity.valid,
          };
        });
        break;
      case "sold":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            sold: target.checked,
          };
        });
        break;
      case "image":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            image: file,
            validImage: checkImageValidity(file),
          };
        });
        break;
      default:
        // XXX
        break;
    }
  };

  const submit = async () => {
    setAttempted(true);
    if (checkFormValidity()) {
      try {
        setLoading(true);
        await addNewArt(formInfo, collectionId);
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
    } else {
      setError("Error: check each input");
    }
    setLoading(false);
  };

  const toggleAddingArt = () => {
    setAddingArt(!addingArt);
  };

  const addArtButton = (
    <div>
      <button
        className="mt-4 rounded border-2 border-gray-800 bg-purple-300 p-1"
        onClick={toggleAddingArt}
        type="button"
      >
        + add art
      </button>
    </div>
  );

  const displayForm = () => {
    if (currentCollection) {
      return (
        <Modal visible={addingArt}>
          <form className="flex flex-col items-start gap-2">
            <h3 className="text-2xl">New Art</h3>
            <p>{`Adding to collection "${currentCollection.name.toUpperCase()}"`}</p>
            {loading ? (
              <Loading />
            ) : (
              <>
                <div>(Fields marked with * are required)</div>
                <label htmlFor="title">Title*</label>
                <input
                  className="w-full rounded border-2 border-gray-500 p-1"
                  id="title"
                  onChange={handleChange}
                  placeholder="ex: Untitled"
                  required
                  type="text"
                  value={formInfo.title || ""}
                />
                {attempted && !formInfo.validTitle ? (
                  <div className="bg-red-300 p-1">Title required</div>
                ) : null}
                <label htmlFor="medium">Medium*</label>
                <input
                  className="w-full rounded border-2 border-gray-500 p-1"
                  id="medium"
                  onChange={handleChange}
                  placeholder="ex: Oil on canvas"
                  required
                  type="text"
                  value={formInfo.medium || ""}
                />
                {attempted && !formInfo.validMedium ? (
                  <div className="bg-red-300 p-1">Medium required</div>
                ) : null}
                <label htmlFor="medium">Size*</label>
                <input
                  className="w-full rounded border-2 border-gray-500 p-1"
                  id="size"
                  onChange={handleChange}
                  placeholder={`ex: 36" x 24"`}
                  required
                  type="text"
                  value={formInfo.size || ""}
                />
                {attempted && !formInfo.validSize ? (
                  <div className="bg-red-300 p-1">Size required</div>
                ) : null}
                <label htmlFor="sold">Sold:</label>
                <input
                  className="h-6 w-6"
                  checked={formInfo.sold || false}
                  id="sold"
                  onChange={handleChange}
                  type="checkbox"
                />
                <label htmlFor="image">Image*</label>
                <input
                  className="w-full rounded border-2 border-gray-500 p-1"
                  id="image"
                  onChange={handleChange}
                  required
                  type="file"
                />
                {attempted && !formInfo.validImage ? (
                  <div className="bg-red-300 p-1">Image required</div>
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
                  {attempted && error ? (
                    <div className="bg-red-300 p-1">{error}</div>
                  ) : null}
                </div>
              </>
            )}
          </form>
        </Modal>
      );
    }

    return (
      <Modal visible={addingArt}>
        <h3 className="text-2xl">Error</h3>
        <p>Invalid collection</p>
        <button
          className="rounded border-2 border-gray-500 bg-red-300 p-1 hover:border-black"
          onClick={toggleAddingArt}
          type="button"
        >
          Cancel
        </button>
      </Modal>
    );
  };

  return (
    <>
      {addArtButton}
      {displayForm()}
    </>
  );
}
