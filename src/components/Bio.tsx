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
            bioVisible ? "bg-brand-red" : "bg-brand-dark-gray"
          } flex w-full items-center justify-between gap-3 p-2 text-brand-white`}
          onClick={toggleBioVisible}
          title={`${bioVisible ? "hide" : "show"} artist info`}
          type="button"
        >
          <h2 className="text-2xl">About the Artist</h2>
          <img
            alt="view / hide biographical info"
            className={`${
              bioVisible ? "rotate-180" : ""
            } h-[12px] invert transition-transform`}
            title="view / hide biographical info"
            src={downIcon}
          />
        </button>
        <pre
          className={`${
            bioVisible ? "max-h-[10000px]" : "max-h-0 overflow-hidden opacity-0"
          } whitespace-pre-wrap border-2 border-t-0 border-brand-red bg-brand-white p-2 font-sans text-xl transition-max-height`}
        >
          {bio}
        </pre>
      </div>
    );
  }

  return null;
}
