import { useState } from "react";
import Loading from "./Loading";
import Modal from "./Modal";
import { updateHomeImage } from "@util/database";

interface Props {
  imageURL: string;
}

interface NewImage {
  file: null | File;
  valid: boolean;
}

export default function EditProfileImage({ imageURL }: Props) {
  const [attempted, setAttempted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [newImage, setNewImage] = useState<NewImage>({
    file: null,
    valid: false,
  });

  const cancel = () => {
    setAttempted(false);
    setLoading(false);
    setEditing(false);
    setError(null);
    setNewImage({
      file: null,
      valid: false,
    });
  };

  const checkImageValidity = (file: File | null) => {
    if (file && file.type.split("/")[0] === "image") {
      return true;
    }
    return false;
  };

  const changeImage = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    setError(null);
    setNewImage({
      file,
      valid: checkImageValidity(file),
    });
  };

  const edit = () => {
    setEditing(true);
  };

  const submit = async () => {
    setAttempted(true);
    if (newImage.file && checkImageValidity(newImage.file)) {
      try {
        setLoading(true);
        await updateHomeImage(newImage.file);
        cancel();
      } catch (err) {
        setLoading(false);
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
  };

  const handleDropFile = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setError(null);
    setNewImage({
      file,
      valid: checkImageValidity(file),
    });
  };

  const displayForm = () => {
    return (
      <Modal close={cancel} visible={editing}>
        <form>
          <h3 className="w-full bg-brand-red p-2 text-2xl text-brand-white">
            Edit Homepage Image
          </h3>
          {loading ? (
            <div className="flex items-center justify-center p-4 min-h-[300px]">
              <Loading />
            </div>
          ) : (
            <div className="flex flex-col items-start gap-2 p-2">
              <img
                alt="Homepage image"
                className="max-h-[400px] self-center border-2 border-brand-red p-1"
                src={
                  newImage.file && checkImageValidity(newImage.file)
                    ? URL.createObjectURL(newImage.file)
                    : imageURL
                }
              />
              <label
                className="flex h-[160px] w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-brand-black"
                htmlFor="image"
                onDragOver={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onDrop={handleDropFile}
              >
                <div className="cursor-pointer bg-brand-dark-gray p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black">
                  Choose File
                </div>
                <span>or drop file here</span>
                {newImage.file ? <span>{newImage.file.name}</span> : null}
              </label>
              <input
                accept="image/*"
                hidden
                id="image"
                onChange={changeImage}
                required
                type="file"
              />

              {attempted && !newImage.valid ? (
                <div className="w-full bg-brand-red p-2 text-brand-white">
                  Image required
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <button
                  className="bg-brand-blue p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
                  onClick={submit}
                  type="button"
                >
                  Submit
                </button>
                <button
                  className="bg-[#ff6600] p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
                  onClick={cancel}
                  type="button"
                >
                  Cancel
                </button>
              </div>
              {attempted && error ? (
                <div className="w-full bg-brand-red p-2">{error}</div>
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
        className="bg-brand-blue p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
        onClick={edit}
        type="button"
      >
        Edit Image
      </button>
    </>
  );
}
