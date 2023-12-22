import { useState } from "react";
import { Exhibition } from "@customTypes/exhibitions";
import Blur from "./Blur";
import Loading from "./Loading";
import { deleteExhibition, updateExhibition } from "@util/database";

interface Props {
  exhibition: Exhibition;
  inDashboard: boolean;
}

export default function ExhibitionItem({ exhibition, inDashboard }: Props) {
  const [attempted, setAttempted] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [gallery, setGallery] = useState(exhibition.gallery);
  const [galleryLocation, setGalleryLocation] = useState({
    value: exhibition.location,
    valid: true,
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState({
    value: exhibition.title,
    valid: true,
  });
  const [year, setYear] = useState({
    value: exhibition.year,
    valid: true,
  });

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    switch (target.id) {
      case "year":
        setYear({
          value: +target.value,
          valid: target.validity.valid,
        });
        break;
      case "title":
        setTitle({
          value: target.value,
          valid: target.validity.valid,
        });
        break;
      case "gallery":
        setGallery(target.value);
        break;
      case "location":
        setGalleryLocation({
          value: target.value,
          valid: target.validity.valid,
        });
        break;
      default:
        break;
    }
  };

  const cancel = () => {
    toggleModal();
    setAttempted(false);
    setError(null);
    setGallery(exhibition.gallery);
    setGalleryLocation({
      value: exhibition.location,
      valid: true,
    });
    setTitle({
      value: exhibition.title,
      valid: true,
    });
    setYear({
      value: exhibition.year,
      valid: true,
    });
  };

  const checkFormValidity = () => {
    return (
      year.value &&
      year.valid &&
      title.value &&
      title.valid &&
      galleryLocation.value &&
      galleryLocation.valid
    );
  };

  const submit = async () => {
    setAttempted(true);
    if (checkFormValidity()) {
      setLoading(true);
      try {
        const newExhibition: Exhibition = {
          added: exhibition.added,
          exhibitionId: exhibition.exhibitionId,
          gallery,
          location: galleryLocation.value,
          title: title.value,
          year: year.value,
        };
        await updateExhibition(newExhibition);
        setLoading(false);
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

  const toggleConfirm = () => {
    setConfirmingDelete(!confirmingDelete);
  };

  const confirmDelete = async () => {
    setAttempted(true);
    setLoading(true);
    try {
      await deleteExhibition(exhibition.exhibitionId);
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
              className="rounded border-2 border-gray-500 bg-orange-300 p-1 hover:border-black"
              onClick={toggleConfirm}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded border-2 border-gray-500 bg-red-400 p-1 hover:border-black"
              onClick={confirmDelete}
              type="button"
            >
              Delete
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
          className="rounded border-2 border-gray-500 bg-orange-300 p-1 hover:border-black"
          onClick={cancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="rounded border-2 border-gray-500 bg-red-400 p-1 hover:border-black"
          onClick={toggleConfirm}
          type="button"
        >
          Delete
        </button>
      </div>
    );
  };

  const displayForm = () => {
    return (
      <div
        // XXX
        // remove ternary?
        className={`${
          modalVisible ? null : "-translate-y-[110%]"
        } absolute left-0 top-0 z-30 flex h-full w-full items-start justify-center transition-transform`}
      >
        <div className="my-[100px] w-full max-w-[420px] rounded bg-white p-3 text-xl shadow-xl">
          <form className="flex flex-col items-start gap-2">
            <h3 className="text-2xl">Edit Exhibition</h3>
            {loading ? (
              <Loading />
            ) : (
              <>
                <div>(Fields marked with * are required)</div>
                <label htmlFor="year">Year*</label>
                <input
                  className="w-full rounded border-2 border-gray-500 p-1"
                  type="number"
                  id="year"
                  max="2100"
                  min="1900"
                  onChange={handleChange}
                  required
                  value={year.value || 2023}
                />
                {attempted && !year.valid ? (
                  <div className="bg-red-300 p-1">
                    Year required (1900 - 2100)
                  </div>
                ) : null}
                <label htmlFor="title">Title*</label>
                <input
                  className="w-full rounded border-2 border-gray-500 p-1"
                  type="text"
                  id="title"
                  onChange={handleChange}
                  placeholder="ex: Art Show"
                  required
                  value={title.value || ""}
                />
                {attempted && !title.valid ? (
                  <div className="bg-red-300 p-1">Title required</div>
                ) : null}
                <label htmlFor="gallery">Gallery</label>
                <input
                  className="w-full rounded border-2 border-gray-500 p-1"
                  type="text"
                  id="gallery"
                  onChange={handleChange}
                  placeholder="ex: Some Gallery"
                  value={gallery || ""}
                />
                <label htmlFor="location">Location*</label>
                <input
                  className="w-full rounded border-2 border-gray-500 p-1"
                  type="text"
                  id="location"
                  onChange={handleChange}
                  placeholder="ex: Los Angeles, CA"
                  required
                  value={galleryLocation.value}
                />
                {attempted && !galleryLocation.valid ? (
                  <div className="bg-red-300 p-1">Location required</div>
                ) : null}
                {displayControls()}
                {attempted && error ? (
                  <div className="bg-red-300 p-1">{error}</div>
                ) : null}
              </>
            )}
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      {modalVisible ? <Blur /> : null}
      {displayForm()}
      <li className="flex items-center gap-4">
        {inDashboard ? (
          <button
            className="rounded border-2 border-black bg-neutral-300 p-1"
            onClick={toggleModal}
          >
            Edit
          </button>
        ) : null}
        <div className="flex flex-wrap">
          <div>{`${exhibition.year} - "${exhibition.title}"`}</div>
          <div>
            {`(${exhibition.gallery ? `${exhibition.gallery}, ` : ""}${
              exhibition.location
            })`}
          </div>
        </div>
      </li>
    </>
  );
}
