import { useState } from "react";

import Blur from "./Blur";

export default function NewExhibition() {
  const [attempted, setAttempted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [gallery, setGallery] = useState("");
  const [galleryLocation, setGalleryLocation] = useState({
    value: "",
    valid: false,
  });
  const [title, setTitle] = useState({ value: "", valid: false });
  const [year, setYear] = useState({ value: 2023, valid: true });

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const cancel = () => {
    toggleModal();
    setYear({
      value: 2023,
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

  const submit = () => {
    setAttempted(true);
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
        <div className="my-[100px] w-full max-w-[320px] rounded bg-white p-3 text-xl shadow-xl">
          <h3 className="text-2xl">New Exhibition</h3>
          <form className="flex flex-col items-start gap-2">
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
              <div className="bg-red-300 p-1">Year required (1900 - 2100)</div>
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
              value={gallery}
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
  };

  return (
    <div>
      {modalVisible ? <Blur /> : null}
      {displayForm()}
      <button
        className="rounded border-2 border-black bg-neutral-300 p-1"
        onClick={toggleModal}
        type="button"
      >
        + New Exhibition
      </button>
    </div>
  );
}
