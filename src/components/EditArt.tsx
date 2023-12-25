import { useEffect, useState } from "react";
import Loading from "./Loading";
import Art, { ArtFormInfo } from "@customTypes/art";
import { deleteArt, updateArt } from "@util/database";

interface Props {
  artDetail: Art;
  closeArtDetail: () => void;
}

export default function EditArt({ artDetail, closeArtDetail }: Props) {
  const [attempted, setAttempted] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<null | string>(null);
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormInfo({
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
      setLoading(true);
      try {
        // XXX
        // SUBMIT EDIT
        await updateArt(artDetail.artId, formInfo);
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
          <div className="bg-red-300 p-1">Confirm Delete</div>
          <div className="p-1 text-red-800">
            Are you sure? This cannot be undone!
          </div>
          <div className="flex gap-2">
            <button
              className="rounded border-2 border-gray-500 bg-red-400 p-1 hover:border-black"
              onClick={confirmDelete}
              type="button"
            >
              Delete
            </button>
            <button
              className="rounded border-2 border-gray-500 bg-orange-300 p-1 hover:border-black"
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
          className="rounded border-2 border-gray-500 bg-green-300 p-1 hover:border-black"
          onClick={submit}
          type="button"
        >
          Submit
        </button>
        <button
          className="rounded border-2 border-gray-500 bg-red-400 p-1 hover:border-black"
          onClick={toggleConfirm}
          type="button"
        >
          Delete
        </button>
        <button
          className="rounded border-2 border-gray-500 bg-orange-300 bg-red-300 p-1 hover:border-black"
          onClick={cancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    );
  };

  return (
    <div className="fixed w-full max-w-[420px] rounded bg-white p-3 text-xl shadow-xl">
      <h3 className="text-2xl">Edit Art</h3>
      {loading ? (
        <Loading />
      ) : (
        <>
          <img
            alt={artDetail.title}
            className="max-h-[320px]"
            src={artDetail.imageURL ? artDetail.imageURL : ""}
          />
          <form className="flex flex-col items-start gap-2">
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
            {displayControls()}
            {attempted && error ? (
              <div className="bg-red-300 p-1">{error}</div>
            ) : null}
          </form>
        </>
      )}
    </div>
  );
}
