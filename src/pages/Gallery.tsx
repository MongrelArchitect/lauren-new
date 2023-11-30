import { useContext } from "react";
import { useParams } from "react-router-dom";
import { CollectionsContext } from "@contexts/collections";

export default function Gallery() {
  const { collectionId } = useParams();
  const allCollections = useContext(CollectionsContext);
  const currentCollection = allCollections && collectionId
    ? allCollections[collectionId]
    : null;
  console.log(currentCollection);

  if (currentCollection) {
    return <div>{currentCollection.name.toUpperCase()}</div>;
  }
  return <div>Nothing to show</div>
}
