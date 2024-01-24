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
      <Modal close={cancel} visible={editing}>
        <form className="flex flex-col items-start gap-2">
          <h3 className="w-full bg-brand-red p-2 text-2xl text-brand-white">
            Edit Article
          </h3>
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center self-center p-4">
              <Loading />
            </div>
          ) : (
            <div className="flex w-full flex-col items-start gap-2 p-2">
              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between">
                  <label htmlFor="year">Year</label>
                  {attempted && !formInfo.year.valid ? (
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
                  value={formInfo.year.value || ""}
                />
              </div>

              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between">
                  <label htmlFor="publication">Publication</label>
                  {attempted && !formInfo.publication.valid ? (
                    <div className="text-brand-red">Publication required</div>
                  ) : null}
                </div>
                <input
                  className={`${
                    attempted
                      ? "invalid:border-brand-red invalid:text-brand-red invalid:outline invalid:outline-brand-red invalid:focus:border-brand-red focus:invalid:outline-brand-red"
                      : null
                  } w-full border-2 border-black p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue`}
                  type="text"
                  id="publication"
                  onChange={handleChange}
                  placeholder="ex: Some Art Blog"
                  required
                  value={formInfo.publication.value || ""}
                />
              </div>

              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between">
                  <label htmlFor="title">Title</label>
                  {attempted && !formInfo.title.valid ? (
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
                  placeholder="ex: Check Out This Artist!"
                  required
                  value={formInfo.title.value || ""}
                />
              </div>

              <div className="flex w-full flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between">
                  <label htmlFor="url">URL</label>
                  {attempted && !formInfo.url.valid ? (
                    <div className="text-brand-red">Valid URL required</div>
                  ) : null}
                </div>
                <input
                  className={`${
                    attempted
                      ? "invalid:border-brand-red invalid:text-brand-red invalid:outline invalid:outline-brand-red invalid:focus:border-brand-red focus:invalid:outline-brand-red"
                      : null
                  } w-full border-2 border-black p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue`}
                  type="url"
                  id="url"
                  onChange={handleChange}
                  placeholder="ex: https://example.com/article"
                  required
                  value={formInfo.url.value || ""}
                />
              </div>

              {displayControls()}
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
        className="my-2 ml-2 border-2 border-brand-black bg-brand-blue p-2 text-brand-white hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black"
        onClick={edit}
      >
        Edit
      </button>
    </>
  );
}
