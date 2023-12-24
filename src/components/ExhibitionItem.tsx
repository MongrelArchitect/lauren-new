import { Exhibition } from "@customTypes/exhibitions";
import EditExhibition from "./EditExhibition";
interface Props {
  exhibition: Exhibition;
  inDashboard: boolean;
}

export default function ExhibitionItem({ exhibition, inDashboard }: Props) {
  return (
    <>
      <li className="flex items-center gap-4">
        {inDashboard ? <EditExhibition exhibition={exhibition} /> : null}
        <div className="flex flex-wrap">
          <div>{`${exhibition.year} - "${exhibition.title}"`}</div>
          <div>
            {`(${exhibition.gallery ? `${exhibition.gallery}, ` : ""}${
              exhibition.location
            })`}
          </div>
        </div>
      </li>
    </>
  );
}
