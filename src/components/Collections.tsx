import { useContext } from "react";
import { Link } from "react-router-dom";

import { CollectionsContext } from "@contexts/collections";

import NewCollection from "./NewCollection";

export default function Collections() {
  const allCollections = useContext(CollectionsContext);

  const displayCollections = () => {
    if (allCollections) {
      const collectionIds = Object.keys(allCollections).sort((a, b) => {
        return allCollections[a].name.localeCompare(allCollections[b].name);
      });
      return (
        <ul className="flex flex-col gap-1 text-2xl">
          {collectionIds.map((collectionId) => {
            const currentCollection = allCollections[collectionId];
            return (
              <li key={collectionId}>
                <Link
                  className="hover:text-brand-red hover:underline"
                  to={`/dashboard/art/${collectionId}`}
                >
                  {currentCollection.name.toUpperCase()}
                </Link>
              </li>
            );
          })}
        </ul>
      );
    }
    return <div>No collections. Add some!</div>;
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <h2 className="bg-brand-red p-2 text-3xl text-brand-white">
        Collections
      </h2>
      <div className="flex flex-col items-start gap-2">
        {displayCollections()}
        <NewCollection />
      </div>
    </div>
  );
}
