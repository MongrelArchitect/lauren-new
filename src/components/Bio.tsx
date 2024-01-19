import { useState } from "react";
import EditBio from "./EditBio";
import downIcon from "@assets/icons/down.svg";

interface Props {
  bio: null | string;
  inDashboard: boolean;
}

export default function Bio({ bio, inDashboard }: Props) {
  const [bioVisible, setBioVisible] = useState(false);

  const toggleBioVisible = () => {
    setBioVisible(!bioVisible);
  };

  if (bio) {
    return (
      <div>
        {inDashboard ? <EditBio bio={bio} /> : null}
        <button
          className={`${
            bioVisible ? "bg-brand-red text-brand-white" : "bg-brand-gray text-brand-black"
          } flex w-full items-center justify-between gap-3 p-2`}
          onClick={toggleBioVisible}
          title={`${bioVisible ? "hide" : "show"} artist info`}
          type="button"
        >
          <h2 className="text-2xl">About the Artist</h2>
          <img
            alt="view / hide biographical info"
            className={`${
              bioVisible ? "rotate-180 invert" : ""
            } h-[12px] transition-transform`}
            title="view / hide biographical info"
            src={downIcon}
          />
        </button>
        <div
          className={`${
            bioVisible ? "max-h-[10000px]" : "max-h-0 overflow-hidden opacity-0"
          } border-2 border-t-0 border-brand-red bg-brand-white transition-all`}
        >
          <pre className="p-2 whitespace-pre-wrap font-sans text-xl">
            {bio}
          </pre>
        </div>
      </div>
    );
  }

  return null;
}
