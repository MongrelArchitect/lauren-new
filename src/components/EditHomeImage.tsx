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

  return (
    <>
      <Modal visible={editing}>
        <h3 className="text-2xl">Edit Homepage Image</h3>
        {loading ? (
          <Loading />
        ) : (
          <form className="flex flex-col items-start gap-2">
            <label htmlFor="image">Image</label>
            <img
              alt="Homepage image"
              className="max-h-[300px]"
              src={
                newImage.file && checkImageValidity(newImage.file)
                  ? URL.createObjectURL(newImage.file)
                  : imageURL
              }
            />
            <input
              accept="image/*"
              className="w-full rounded border-2 border-gray-500 p-1"
              id="image"
              onChange={changeImage}
              required
              type="file"
            />
            {attempted && !newImage.valid ? (
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
            </div>
            {attempted && error ? (
              <div className="bg-red-300 p-1">{error}</div>
            ) : null}
          </form>
        )}
      </Modal>
      <button
        className="rounded border-2 border-black bg-neutral-300 p-1"
        onClick={edit}
        type="button"
      >
        Edit Image
      </button>
    </>
  );
}
