import { useState } from "react";
import Loading from "./Loading";
import Modal from "./Modal";
import { addNewArticle } from "@util/database";
import PressArticle from "@customTypes/pressArticles";

export default function NewPressArticle() {
  const defaultFormInfo = {
    year: {
      value: 2023,
      valid: true,
    },
    publication: {
      value: "",
      valid: false,
    },
    title: {
      value: "",
      valid: false,
    },
    url: {
      value: "",
      valid: false,
    },
  };

  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [formInfo, setFormInfo] = useState(defaultFormInfo);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
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
        const newArticle: PressArticle = {
          added: new Date(),
          publication: formInfo.publication.value,
          year: formInfo.year.value,
          title: formInfo.title.value,
          url: formInfo.url.value,
        };
        await addNewArticle(newArticle);
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
    toggleModal();
  };

  const displayForm = () => {
    return (
      <Modal close={cancel} visible={modalVisible}>
        <form className="flex flex-col items-start gap-2">
          <h3 className="text-2xl">New Article</h3>
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
            </>
          )}
        </form>
      </Modal>
    );
  };

  return (
    <div>
      {displayForm()}
      <button
        className="rounded border-2 border-black bg-neutral-300 p-1"
        onClick={toggleModal}
        type="button"
      >
        + New Article
      </button>
    </div>
  );
}
