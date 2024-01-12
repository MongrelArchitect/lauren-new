import { useState } from "react";
import Loading from "./Loading";
import Modal from "./Modal";
import PressArticle from "@customTypes/pressArticles";
import { deleteArticle, updateArticle } from "@util/database";

interface Props {
  article: PressArticle;
  articleId: string;
}

export default function EditArticle({ article, articleId }: Props) {
  const defaultFormInfo = {
    year: {
      value: article.year,
      valid: true,
    },
    publication: {
      value: article.publication,
      valid: true,
    },
    title: {
      value: article.title,
      valid: true,
    },
    url: {
      value: article.url,
      valid: true,
    },
  };

  const [attempted, setAttempted] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [formInfo, setFormInfo] = useState(defaultFormInfo);
  const [loading, setLoading] = useState(false);

  const edit = () => {
    setAttempted(false);
    setError(null);
    setFormInfo(defaultFormInfo);
    setEditing(true);
  };

  const handleChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    switch (target.id) {
      case "year":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            year: {
              value: +target.value,
              valid: target.validity.valid,
            },
          };
        });
        break;
      case "publication":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            publication: {
              value: target.value,
              valid: target.validity.valid,
            },
          };
        });
        break;
      case "title":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            title: {
              value: target.value,
              valid: target.validity.valid,
            },
          };
        });
        break;
      case "url":
        setFormInfo((prevState) => {
          return {
            ...prevState,
            url: {
              value: target.value,
              valid: target.validity.valid,
            },
          };
        });
        break;
      default:
        // XXX
        break;
    }
  };

  const checkFormValidity = () => {
    return (
      formInfo.year.value &&
      formInfo.year.valid &&
      formInfo.title.value &&
      formInfo.title.valid &&
      formInfo.publication.value &&
      formInfo.publication.valid &&
      formInfo.url.value &&
      formInfo.url.valid
    );
  };

  const submit = async () => {
    setAttempted(true);
    if (checkFormValidity()) {
      setLoading(true);
      try {
        const newArticleInfo: PressArticle = {
          added: article.added,
          publication: formInfo.publication.value,
          year: formInfo.year.value,
          title: formInfo.title.value,
          url: formInfo.url.value,
        };
        await updateArticle(articleId, newArticleInfo);
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

  const cancel = () => {
    setAttempted(false);
    setError(null);
    setFormInfo(defaultFormInfo);
    setEditing(false);
  };

  const confirmDelete = async () => {
    setAttempted(true);
    setLoading(true);
    try {
      await deleteArticle(articleId);
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

  const toggleConfirm = () => {
    setConfirmingDelete(!confirmingDelete);
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
          className="rounded border-2 border-gray-500 bg-orange-300 p-1 hover:border-black"
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
      <Modal close={cancel} visible={editing}>
        <form className="flex flex-col items-start gap-2">
          <h3 className="text-2xl">Edit Article</h3>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div>(All fields required)</div>

              <label htmlFor="year">Year</label>
              <input
                className="w-full rounded border-2 border-gray-500 p-1"
                type="number"
                id="year"
                max="2100"
                min="1900"
                onChange={handleChange}
                required
                value={formInfo.year.value || 2023}
              />
              {attempted && !formInfo.year.valid ? (
                <div className="bg-red-300 p-1">
                  Year required (1900 - 2100)
                </div>
              ) : null}

              <label htmlFor="publication">Publication</label>
              <input
                className="w-full rounded border-2 border-gray-500 p-1"
                type="text"
                id="publication"
                onChange={handleChange}
                placeholder="ex: Some Art Blog"
                required
                value={formInfo.publication.value || ""}
              />
              {attempted && !formInfo.publication.valid ? (
                <div className="bg-red-300 p-1">Publication required</div>
              ) : null}

              <label htmlFor="title">Title</label>
              <input
                className="w-full rounded border-2 border-gray-500 p-1"
                type="text"
                id="title"
                onChange={handleChange}
                placeholder="ex: Check Out This Artist!"
                required
                value={formInfo.title.value || ""}
              />
              {attempted && !formInfo.title.valid ? (
                <div className="bg-red-300 p-1">Title required</div>
              ) : null}

              <label htmlFor="url">URL</label>
              <input
                className="w-full rounded border-2 border-gray-500 p-1"
                type="url"
                id="url"
                onChange={handleChange}
                placeholder="ex: https://example.com/article"
                required
                value={formInfo.url.value || ""}
              />
              {attempted && !formInfo.url.valid ? (
                <div className="bg-red-300 p-1">Valid URL required</div>
              ) : null}

              {displayControls()}
              {attempted && error ? (
                <div className="bg-red-300 p-1">{error}</div>
              ) : null}
            </>
          )}
        </form>
      </Modal>
    );
  };

  return (
    <>
      {displayForm()}
      <button
        className="rounded border-2 border-black bg-neutral-300 p-1"
        onClick={edit}
      >
        Edit
      </button>
    </>
  );
}
