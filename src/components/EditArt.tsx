import { useContext, useEffect, useState } from "react";
import { CollectionsContext } from "@contexts/collections";
import Loading from "./Loading";
import Art, { ArtFormInfo } from "@customTypes/art";
import { deleteArt, updateArt } from "@util/database";

interface Props {
  artDetail: Art;
  children: React.ReactNode;
  closeArtDetail: () => void;
}

export default function EditArt({
  artDetail,
  children,
  closeArtDetail,
}: Props) {
  const collections = useContext(CollectionsContext);
  const [attempted, setAttempted] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<null | string>(null);
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setFormInfo({
      collection: artDetail ? artDetail.collection : "",
      title: artDetail ? artDetail.title : "",
      validTitle: true,
      medium: artDetail ? artDetail.medium : "",
      validMedium: true,
      size: artDetail ? artDetail.size : "",
      validSize: true,
      sold: artDetail ? artDetail.sold : false,
      image: null,
      validImage: true,
    });
  }, [artDetail]);

  const cancel = () => {
    closeArtDetail();
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
      case "collection":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            collection: target.value,
          };
        });
        break;
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
      setLoading(true);
      try {
        // if the collection was changed, update the "added" timestamp since
        // the piece was just "added" to the new collection
        const updateTimestamp = formInfo.collection !== artDetail.collection;
        await updateArt(artDetail.artId, formInfo, updateTimestamp);
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
    } else {
      setError("Error: check each input");
    }
  };

  const toggleConfirm = () => {
    setConfirmingDelete(!confirmingDelete);
  };

  const confirmDelete = async () => {
    setAttempted(true);
    setLoading(true);
    try {
      await deleteArt(artDetail);
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
  };

  const displayControls = () => {
    if (confirmingDelete) {
      return (
        <div className="flex w-full flex-col gap-2">
          <div className="bg-brand-orange p-2 text-brand-white">
            Confirm Delete
          </div>
          <div className="flex flex-wrap gap-1 text-brand-red">
            <span>Are you sure?</span>
            <strong>This cannot be undone!</strong>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="border-2 border-brand-black bg-brand-red p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
              onClick={confirmDelete}
              type="button"
            >
              Delete
            </button>
            <button
              className="border-2 border-brand-black bg-brand-yellow p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
              onClick={toggleConfirm}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-wrap gap-2">
        <button
          className="border-2 border-brand-black bg-brand-blue p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
          onClick={submit}
          type="button"
        >
          Submit
        </button>
        <button
          className="border-2 border-brand-black bg-brand-orange p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
          onClick={toggleConfirm}
          type="button"
        >
          Delete
        </button>
        <button
          className="border-2 border-brand-black bg-brand-yellow p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
          onClick={cancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    );
  };

  const displayCollectionOptions = () => {
    if (collections) {
      const collectionIds = Object.keys(collections).sort((a, b) => {
        return collections[a].name.localeCompare(collections[b].name);
      });
      return collectionIds.map((collectionId) => {
        const collection = collections[collectionId];
        return (
          <option key={collectionId} value={collectionId}>
            {collection.name.toUpperCase()}
          </option>
        );
      });
    }
    return null;
  };

  return (
    <>
      {loading ? <Loading overlay /> : null}
      <>
        <form className="flex flex-col items-start gap-2">
          <h3 className="w-full bg-brand-red p-2 text-2xl text-brand-white">
            Edit Art
          </h3>
          <div className="flex w-full flex-col items-start gap-2 p-2">
            <img
              alt={artDetail.title}
              className="max-h-[240px] self-center border-2 border-brand-red p-1"
              onLoad={() => {
                setLoading(false);
              }}
              src={artDetail.imageURL ? artDetail.imageURL : ""}
            />
            <div className="flex w-full flex-col gap-1">
              <label htmlFor="collection">Collection</label>
              <select
                className="w-full border-2 border-black bg-brand-white p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue"
                id="collection"
                onChange={handleChange}
                defaultValue={artDetail.collection}
              >
                {displayCollectionOptions()}
              </select>
            </div>
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
            {displayControls()}
            {attempted && error ? (
              <div className="w-full bg-brand-red p-2 text-brand-white">
                {error}
              </div>
            ) : null}
          </div>
        </form>
        {children}
      </>
    </>
  );
}
