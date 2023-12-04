import Art from "@customTypes/art";

interface Props {
  art: Art;
}

export default function ShowArt({ art }: Props) {
  return (
    <div>
      <img alt={art.title} src={art.thumbURL ? art.thumbURL : ""} />
    </div>
  );
}
