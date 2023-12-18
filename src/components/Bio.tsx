import { useState } from "react";
import { updateBio } from "@util/database";

import Loading from "./Loading";

interface Props {
  bio: null | string;
  inDashboard: boolean;
}

export default function Bio({ bio, inDashboard }: Props) {
  const [attempted, setAttempted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [formInfo, setFormInfo] = useState({
    bio,
    valid: true,
  });
  const [loading, setLoading] = useState(false);

  const cancelEdit = () => {
    setFormInfo({
      bio,
      valid: true,
    });
    setAttempted(false);
    setError(null);
    setEditing(false);
  };

  const edit = () => {
    setFormInfo({
      bio,
      valid: true,
    });
    setEditing(true);
  };

  const changeBio = (event: React.SyntheticEvent) => {
    setError(null);
    const target = event.target as HTMLTextAreaElement;
    setFormInfo({
      bio: target.value,
      valid: target.validity.valid,
    });
  };

  const submitEdit = async () => {
    setAttempted(true);
    if (formInfo.bio && formInfo.valid) {
      setLoading(true);
      try {
        await updateBio(formInfo.bio);
        cancelEdit();
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
    if (loading) {
      return <Loading />;
    }
    return (
      <form className="flex flex-col gap-1">
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          onChange={changeBio}
          required
          rows={5}
          value={formInfo.bio || ""}
        />
      </form>
    );
  };

  const displayControls = () => {
    if (loading) {
      return null;
    }
    if (editing) {
      return (
        <div className="flex flex-col gap-1">
          {attempted && !formInfo.valid ? (
            <div className="bg-red-300 p-1">Bio required</div>
          ) : null}
          <div className="flex gap-1">
            <button
              className="rounded border-2 border-black bg-rose-300 p-1"
              onClick={cancelEdit}
              type="button"
            >
              Cancel Edit
            </button>
            <button
              className="rounded border-2 border-black bg-green-300 p-1"
              onClick={submitEdit}
              type="button"
            >
              Submit
            </button>
          </div>
          {attempted && error ? (
            <div className="bg-red-300 p-1">{error}</div>
          ) : null}
        </div>
      );
    }
    return (
      <div>
        <button
          className="rounded border-2 border-black bg-neutral-300 p-1"
          onClick={edit}
          type="button"
        >
          Edit Bio
        </button>
      </div>
    );
  };

  if (bio) {
    return (
      <>
        {inDashboard ? displayControls() : null}
        {editing ? (
          displayForm()
        ) : (
          <pre className="whitespace-pre-wrap">{bio}</pre>
        )}
      </>
    );
  }

  return null;
}
