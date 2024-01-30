import { useState } from "react";
import EditBio from "./EditBio";
import downIcon from "@assets/icons/down.svg";

interface Props {
  bio: null | string;
  inDashboard: boolean;
}

export default function Bio({ bio, inDashboard }: Props) {
  const [bioVisible, setBioVisible] = useState(true);

  const toggleBioVisible = () => {
    setBioVisible(!bioVisible);
  };

  if (bio) {
    return (
      <div className="flex flex-col items-start gap-2">
        {inDashboard ? <EditBio bio={bio} /> : null}
        <div>
          <button
            aria-label={`${bioVisible ? "hide" : "show"} artist info`}
            aria-controls="bio"
            aria-expanded={bioVisible}
            className={`${
              bioVisible
                ? "bg-brand-red text-brand-white"
                : "bg-brand-gray text-brand-black"
            } flex w-full items-center justify-between gap-3 p-2`}
            onClick={toggleBioVisible}
            title={`${bioVisible ? "Hide" : "Show"} artist info`}
            type="button"
          >
            <h2 className="text-2xl">About the Artist</h2>
            <img
              alt=""
              className={`${
                bioVisible ? "rotate-180 invert" : ""
              } h-[12px] transition-transform`}
              src={downIcon}
            />
          </button>
          <div
            className={`${
              bioVisible
                ? "max-h-[10000px]"
                : "max-h-0 overflow-hidden opacity-0"
            } border-2 border-t-0 border-brand-red bg-brand-white transition-all`}
          >
            <pre
              aria-hidden={!bioVisible}
              className="whitespace-pre-wrap p-2 font-sans text-xl"
              id="bio"
            >
              {bio}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
