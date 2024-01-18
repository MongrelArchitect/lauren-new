import { Exhibition } from "@customTypes/exhibitions";
import EditExhibition from "./EditExhibition";
interface Props {
  exhibition: Exhibition;
  exhibitionIndex: number;
  inDashboard: boolean;
}

export default function ExhibitionItem({
  exhibition,
  exhibitionIndex,
  inDashboard,
}: Props) {
  return (
    <>
      <li className="flex items-center gap-4">
        {inDashboard ? <EditExhibition exhibition={exhibition} /> : null}
        <div
          className={`${
            exhibitionIndex % 2 === 0 ? "bg-brand-white" : "bg-brand-gray"
          } flex w-full flex-wrap gap-3 p-2`}
        >
          <b>{exhibition.year}</b>
          <i>{exhibition.title}</i>
          <span>
            {`(${exhibition.gallery ? `${exhibition.gallery}, ` : ""}${
              exhibition.location
            })`}
          </span>
        </div>
      </li>
    </>
  );
}
