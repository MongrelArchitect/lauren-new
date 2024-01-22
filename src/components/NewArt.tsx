import { useContext, useState } from "react";
import { CollectionsContext } from "@contexts/collections";
import { addNewArt } from "@util/database";
import { ArtFormInfo } from "@customTypes/art";
import Loading from "./Loading";
import Modal from "./Modal";
import fileIcon from "@assets/icons/file-alert.svg";

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
    collection: "",
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
      collection: "",
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
    <button
      className="bg-brand-blue p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
      onClick={toggleAddingArt}
      type="button"
    >
      + Add Art
    </button>
  );

  const setFilePreviewURL = () => {
    if (formInfo.image && checkImageValidity(formInfo.image)) {
      return URL.createObjectURL(formInfo.image);
    }
    return fileIcon;
  };

  const displayForm = () => {
    if (currentCollection) {
      return (
        <Modal close={cancel} visible={addingArt}>
          <form className="flex flex-col items-start gap-2">
            <h3 className="flex w-full flex-wrap gap-2 bg-brand-red p-2 text-2xl text-brand-white">
              <span>New Art</span>
              <div>{`(in "${currentCollection.name.toUpperCase()}")`}</div>
            </h3>
            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center self-center p-4">
                <Loading />
              </div>
            ) : (
              <div className="flex w-full flex-col items-start gap-2 p-2">
                <div className="flex w-full flex-col gap-1">
                  <div className="flex flex-wrap items-center justify-between">
                    <label htmlFor="title">Title</label>
                    {attempted && !formInfo.validTitle ? (
                      <div className="text-brand-red">Title required</div>
                    ) : null}
                  </div>
                  <input
                    className={`${
                      attempted
                        ? "invalid:border-brand-red invalid:text-brand-red invalid:outline invalid:outline-brand-red invalid:focus:border-brand-red focus:invalid:outline-brand-red"
                        : null
                    } w-full border-2 border-black p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue`}
                    id="title"
                    onChange={handleChange}
                    placeholder="ex: Untitled"
                    required
                    type="text"
                    value={formInfo.title || ""}
                  />
                </div>
                <div className="flex w-full flex-col gap-1">
                  <div className="flex flex-wrap items-center justify-between">
                    <label htmlFor="medium">Medium</label>
                    {attempted && !formInfo.validMedium ? (
                      <div className="text-brand-red">Medium required</div>
                    ) : null}
                  </div>
                  <input
                    className={`${
                      attempted
                        ? "invalid:border-brand-red invalid:text-brand-red invalid:outline invalid:outline-brand-red invalid:focus:border-brand-red focus:invalid:outline-brand-red"
                        : null
                    } w-full border-2 border-black p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue`}
                    id="medium"
                    onChange={handleChange}
                    placeholder="ex: Oil on canvas"
                    required
                    type="text"
                    value={formInfo.medium || ""}
                  />
                </div>
                <div className="flex w-full flex-col gap-1">
                  <div className="flex flex-wrap items-center justify-between">
                    <label htmlFor="medium">Size</label>
                    {attempted && !formInfo.validSize ? (
                      <div className="text-brand-red">Size required</div>
                    ) : null}
                  </div>
                  <input
                    className={`${
                      attempted
                        ? "invalid:border-brand-red invalid:text-brand-red invalid:outline invalid:outline-brand-red invalid:focus:border-brand-red focus:invalid:outline-brand-red"
                        : null
                    } w-full border-2 border-black p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue`}
                    id="size"
                    onChange={handleChange}
                    placeholder={`ex: 36" x 24"`}
                    required
                    type="text"
                    value={formInfo.size || ""}
                  />
                </div>
                <div className="flex w-full flex-col gap-1">
                  <label htmlFor="sold">Sold:</label>
                  <input
                    className="h-6 w-6 accent-brand-blue"
                    checked={formInfo.sold || false}
                    id="sold"
                    onChange={handleChange}
                    type="checkbox"
                  />
                </div>

                <div className="flex w-full flex-col gap-1">
                  <div className="flex flex-wrap items-center justify-between">
                    <div>Image:</div>
                    {attempted && !formInfo.validImage ? (
                      <div className="text-brand-red">Image required</div>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <label
                      className="flex min-h-[160px] flex-1 flex-col items-center justify-center gap-1 border-2 border-dashed border-brand-black p-2 text-center"
                      htmlFor="image"
                    >
                      <div className="cursor-pointer bg-brand-dark-gray p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black">
                        Choose File
                      </div>
                      <span>or drop file here</span>
                      {formInfo.image ? (
                        <span className="text-base">{formInfo.image.name}</span>
                      ) : null}
                      {formInfo.image && !formInfo.validImage ? (
                        <div className="text-base text-brand-red">
                          Not a valid image file!
                        </div>
                      ) : null}
                    </label>
                    <input
                      accept="image/*"
                      hidden
                      id="image"
                      onChange={handleChange}
                      required
                      type="file"
                    />
                    {formInfo.image ? (
                      <img
                        alt="Homepage image"
                        className={`${
                          formInfo.image && !checkImageValidity(formInfo.image)
                            ? "red-icon"
                            : null
                        } max-h-[160px] self-center border-2 border-brand-red p-1`}
                        src={setFilePreviewURL()}
                      />
                    ) : null}
                  </div>
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
    }

    return (
      <Modal close={cancel} visible={addingArt}>
        <h3 className="w-full bg-brand-red text-2xl text-brand-white">Error</h3>
        <p>Invalid collection</p>
        <button
          className="bg-brand-yellow p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
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
