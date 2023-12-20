import { Exhibition } from "@customTypes/exhibitions";

interface Props {
  exhibition: Exhibition;
}

export default function ExhibitionItem({ exhibition }: Props) {
  return (
    <li>
      {`${exhibition.year} - "${exhibition.title}" (${exhibition.gallery}, ${exhibition.location})`}
    </li>
  );
}
