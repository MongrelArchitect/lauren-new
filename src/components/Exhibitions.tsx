import { useState } from "react";

import ExhibitionItem from "@components/ExhibitionItem";
import NewExhibition from "@components/NewExhibition";

import Exhibitions from "@customTypes/exhibitions";

import downIcon from "@assets/icons/down.svg";

interface Props {
  exhibitions: Exhibitions;
  inDashboard: boolean;
}

export default function ExhibitionsList({ exhibitions, inDashboard }: Props) {
  const [exhibitionsVisible, setExhibitionsVisible] = useState(true);

  const toggleExhibitionsVisible = () => {
    setExhibitionsVisible(!exhibitionsVisible);
  };

  const exhibitionIds = Object.keys(exhibitions).sort((a, b) => {
    // sort by year, then by added timestamp
    return (
      exhibitions[b].year - exhibitions[a].year ||
      exhibitions[b].added.getTime() - exhibitions[a].added.getTime()
    );
  });

  return (
    <div>
      {inDashboard ? <NewExhibition /> : null}
      <button
        className={`${
          exhibitionsVisible ? "bg-brand-red text-brand-white" : "bg-brand-gray text-brand-black"
        } flex w-full items-center justify-between gap-3 p-2`}
        onClick={toggleExhibitionsVisible}
        title={`${exhibitionsVisible ? "hide" : "show"} exhibitions`}
        type="button"
      >
        <h2 className="text-2xl">Selected Exhibitions</h2>
        <img
          alt=""
          className={`${
            exhibitionsVisible ? "rotate-180 invert" : ""
          } h-[12px] transition-transform`}
          src={downIcon}
        />
      </button>

      <ul 
        className={`${
          exhibitionsVisible ? "max-h-[10000px]" : "max-h-0 overflow-hidden opacity-0"
        } flex flex-col gap-2 border-2 border-t-0 border-brand-red bg-brand-white font-sans text-xl transition-all`}
      >
        {exhibitionIds.map((exhibitionId, index) => {
          const current = exhibitions[exhibitionId];
          return (
            <ExhibitionItem
              exhibition={current}
              exhibitionIndex={index}
              inDashboard={inDashboard}
              key={exhibitionId}
            />
          );
        })}
      </ul>
    </div>
  );
}
