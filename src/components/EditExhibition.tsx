import { useState } from "react";
import { deleteExhibition, updateExhibition } from "@util/database";
import { Exhibition } from "@customTypes/exhibitions";
import Loading from "./Loading";
import Modal from "./Modal";

interface Props {
  exhibition: Exhibition;
}

export default function EditExhibition({ exhibition }: Props) {
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

  const edit = () => {
    toggleModal();
    setYear({
      value: exhibition.year,
      valid: true,
    });
    setTitle({
      value: exhibition.title,
      valid: true,
    });
    setGallery(exhibition.gallery);
    setGalleryLocation({
      value: exhibition.location,
      valid: true,
    });
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
          <div className="bg-brand-orange p-2 text-brand-white">
            Confirm Delete
          </div>
          <div className="flex flex-wrap gap-1 text-brand-red">
            <span>Are you sure?</span>
            <strong>This cannot be undone!</strong>
          </div>
          <div className="flex gap-2">
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

  const displayForm = () => {
    return (
      <Modal close={cancel} visible={modalVisible}>
        <form className="flex flex-col items-start gap-2">
          <h3 className="w-full bg-brand-red p-2 text-2xl text-brand-white">
            Edit Exhibition
          </h3>
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center self-center p-4">
              <Loading />
            </div>
          ) : (
            <div className="flex w-full flex-col items-start gap-2 p-2">
              <div>(Fields marked with * are required)</div>
              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between">
                  <label htmlFor="year">Year*</label>
                  {attempted && !year.valid ? (
                    <div className="text-brand-red">
                      Year required (1900 - 2100)
                    </div>
                  ) : null}
                </div>
              </div>
              <input
                className={`${
                  attempted
                    ? "invalid:border-brand-red invalid:text-brand-red invalid:outline invalid:outline-brand-red invalid:focus:border-brand-red focus:invalid:outline-brand-red"
                    : null
                } w-full border-2 border-black p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue`}
                type="number"
                id="year"
                max="2100"
                min="1900"
                onChange={handleChange}
                required
                value={year.value || ""}
              />
              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between">
                  <label htmlFor="title">Title*</label>
                  {attempted && !title.valid ? (
                    <div className="text-brand-red">Title required</div>
                  ) : null}
                </div>
                <input
                  className={`${
                    attempted
                      ? "invalid:border-brand-red invalid:text-brand-red invalid:outline invalid:outline-brand-red invalid:focus:border-brand-red focus:invalid:outline-brand-red"
                      : null
                  } w-full border-2 border-black p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue`}
                  type="text"
                  id="title"
                  onChange={handleChange}
                  placeholder="ex: Art Show"
                  required
                  value={title.value || ""}
                />
              </div>
              <div className="flex w-full flex-col gap-1">
                <label htmlFor="gallery">Gallery</label>
                <input
                  className="w-full border-2 border-black p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue"
                  type="text"
                  id="gallery"
                  onChange={handleChange}
                  placeholder="ex: Some Gallery"
                  value={gallery || ""}
                />
              </div>
              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between">
                  <label htmlFor="location">Location*</label>
                  {attempted && !galleryLocation.valid ? (
                    <div className="text-brand-red">Location required</div>
                  ) : null}
                </div>
                <input
                  className={`${
                    attempted
                      ? "invalid:border-brand-red invalid:text-brand-red invalid:outline invalid:outline-brand-red invalid:focus:border-brand-red focus:invalid:outline-brand-red"
                      : null
                  } w-full border-2 border-black p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue`}
                  type="text"
                  id="location"
                  onChange={handleChange}
                  placeholder="ex: Los Angeles, CA"
                  required
                  value={galleryLocation.value}
                />
              </div>
              {displayControls()}
              {attempted && error ? (
                <div className="w-full bg-brand-red text-brand-white">
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
      {displayForm()}
      <button
        className="my-2 ml-2 border-2 border-brand-black bg-brand-blue p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
        onClick={edit}
      >
        Edit
      </button>
    </>
  );
}
