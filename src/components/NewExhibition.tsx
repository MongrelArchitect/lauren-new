import { useState } from "react";

import Loading from "./Loading";
import Modal from "./Modal";

import { addNewExhibition } from "@util/database";

export default function NewExhibition() {
  const [attempted, setAttempted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [gallery, setGallery] = useState("");
  const [galleryLocation, setGalleryLocation] = useState({
    value: "",
    valid: false,
  });
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState({ value: "", valid: false });
  const [year, setYear] = useState({ value: 2024, valid: true });

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const cancel = () => {
    toggleModal();
    setYear({
      value: 2024,
      valid: true,
    });
    setTitle({
      value: "",
      valid: false,
    });
    setGallery("");
    setGalleryLocation({
      value: "",
      valid: false,
    });
    setAttempted(false);
    setError(null);
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
        await addNewExhibition(
          year.value,
          title.value,
          gallery,
          galleryLocation.value,
        );
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

  const displayForm = () => {
    return (
      <Modal close={cancel} visible={modalVisible}>
        <form className="flex flex-col items-start gap-2">
          <h3 className="w-full bg-brand-red p-2 text-2xl text-brand-white">
            New Exhibition
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
              </div>
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
                  value={gallery}
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
      {displayForm()}
      <button
        className="border-2 border-brand-black bg-brand-blue p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
        onClick={toggleModal}
        type="button"
      >
        + New Exhibition
      </button>
    </>
  );
}
