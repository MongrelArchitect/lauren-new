import { Dispatch, SetStateAction } from "react";
import Art from "@customTypes/art";

interface Props {
  art: Art;
  inDashboard: boolean;
  setArtDetail: Dispatch<SetStateAction<Art | null>>;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  setEditingArt: Dispatch<SetStateAction<boolean>>;
}

export default function ShowArt({ art, inDashboard, setArtDetail, setModalVisible, setEditingArt }: Props) {
  const handleClick = () => {
    if (inDashboard) {
      setEditingArt(true);
    }
    setArtDetail(art);
    setModalVisible(true);
  };

  return (
    <>
      <button className="w-full h-full max-w-[200px] man-w-[200px]" onClick={handleClick} type="button">
        <img alt={art.title} src={art.thumbURL ? art.thumbURL : ""} />
      </button>
    </>
  );
}
