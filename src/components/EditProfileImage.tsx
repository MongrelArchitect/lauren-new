import { useRef, useState } from "react";
import Loading from "./Loading";
import Modal from "./Modal";
import { updateProfileImage } from "@util/database";
import fileIcon from "@assets/icons/file-alert.svg";

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
        await updateProfileImage(newImage.file);
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

  const setFilePreviewURL = () => {
    if (newImage.file && checkImageValidity(newImage.file)) {
      return URL.createObjectURL(newImage.file);
    }
    if (newImage.file && !checkImageValidity(newImage.file)) {
      return fileIcon;
    }
    return imageURL;
  };

  const filePicker = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (filePicker.current) {
      filePicker.current.click();
    }
  };

  return (
    <>
      <Modal close={cancel} visible={editing}>
        <form>
          <h3 className="w-full bg-brand-red p-2 text-2xl text-brand-white">
            Edit Profile Image
          </h3>
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center p-4">
              <Loading />
            </div>
          ) : (
            <div className="flex flex-col items-start gap-2 p-2">
              <div className="flex flex-wrap items-center justify-between self-stretch">
                <div>Image</div>
                {attempted && !newImage.valid ? (
                  <div className="text-brand-red">Image required</div>
                ) : null}
              </div>
              <img
                alt="Profile image"
                className={`${
                  newImage.file && !checkImageValidity(newImage.file)
                    ? "red-icon"
                    : null
                } max-h-[400px] self-center border-2 border-brand-red p-1`}
                src={setFilePreviewURL()}
              />
              <label
                className="flex min-h-[160px] w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-brand-black p-2"
                htmlFor="image"
                onDragOver={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onDrop={handleDropFile}
              >
                <button 
                  className="cursor-pointer border-2 border-brand-black bg-brand-dark-gray p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
                  onClick={handleClick}
                  type="button"
                >
                  Choose File
                </button>
                <span>or drop file here</span>
                {newImage.file ? (
                  <span className="text-base">{newImage.file.name}</span>
                ) : null}
                {newImage.file && !newImage.valid ? (
                  <div className="text-base text-brand-red">
                    Not a valid image file!
                  </div>
                ) : null}
              </label>
              <input
                accept="image/*"
                hidden
                id="image"
                onChange={changeImage}
                ref={filePicker}
                required
                type="file"
              />
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
                <div className="bg-red-300 p-1">{error}</div>
              ) : null}
            </div>
          )}
        </form>
      </Modal>
      <button
        className="border-2 border-brand-black bg-brand-blue p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
        onClick={edit}
        type="button"
      >
        Edit Image
      </button>
    </>
  );
}
