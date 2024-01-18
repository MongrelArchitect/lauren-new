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
  const [exhibitionsVisible, setExhibitionsVisible] = useState(false);

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
          exhibitionsVisible ? "bg-brand-red" : "bg-brand-dark-gray"
        } flex w-full items-center justify-between gap-3 p-2 text-brand-white`}
        onClick={toggleExhibitionsVisible}
        title={`${exhibitionsVisible ? "hide" : "show"} artist info`}
        type="button"
      >
        <h2 className="text-2xl">Selected Exhibitions</h2>
        <img
          alt="view / hide biographical info"
          className={`${
            exhibitionsVisible ? "rotate-180" : ""
          } h-[12px] invert transition-transform`}
          title="view / hide biographical info"
          src={downIcon}
        />
      </button>

      <ul 
        className={`${
          exhibitionsVisible ? "max-h-[10000px]" : "max-h-0 overflow-hidden opacity-0"
        } flex flex-col gap-2 border-2 border-t-0 border-brand-red bg-brand-white p-2 font-sans text-xl transition-max-height`}
      >
        {exhibitionIds.map((exhibitionId) => {
          const current = exhibitions[exhibitionId];
          return (
            <ExhibitionItem
              exhibition={current}
              inDashboard={inDashboard}
              key={exhibitionId}
            />
          );
        })}
      </ul>
    </div>
  );
}
