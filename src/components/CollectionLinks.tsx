import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { CollectionsContext } from "@contexts/collections";

interface Props {
  menuVisible: boolean;
  toggleMenu: () => void;
}

export default function CollectionLinks({ menuVisible, toggleMenu }: Props) {
  const collections = useContext(CollectionsContext);
  const collectionIds = collections ? Object.keys(collections) : null;
  if (collections && collectionIds) {
    collectionIds.sort((a, b) => {
      return collections[a].name.localeCompare(collections[b].name);
    });
  }

  if (collections && collectionIds) {
    return collectionIds.map((collectionId) => {
      return (
        <li
          className={
            collectionIds.indexOf(collectionId) === 0 && menuVisible
              ? "max-lg:mt-8"
              : ""
          }
          key={collectionId}
        >
          <NavLink
            className="hover:border-b-2 hover:border-active hover:text-active"
            onClick={toggleMenu}
            to={`/art/${collectionId}`}
          >
            {collections[collectionId].name.toUpperCase()}
          </NavLink>
        </li>
      );
    });
  }
  return null;
}
