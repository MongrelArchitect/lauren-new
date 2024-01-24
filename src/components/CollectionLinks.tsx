import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { CollectionsContext } from "@contexts/collections";
import downIcon from "@assets/icons/down.svg";

interface Props {
  dropdownVisible: boolean;
  setDropdownVisible: (value: boolean) => void;
  closeMenu: () => void;
  menuVisible: boolean;
}

export default function CollectionLinks({
  closeMenu,
  dropdownVisible,
  setDropdownVisible,
  menuVisible,
}: Props) {
  const { pathname } = useLocation();
  const viewingArt =
    pathname.includes("art") && !pathname.includes("dashboard");

  const collections = useContext(CollectionsContext);
  const collectionIds = collections ? Object.keys(collections) : null;

  if (collections && collectionIds) {
    collectionIds.sort((a, b) => {
      return collections[a].name.localeCompare(collections[b].name);
    });
  }

  const handleClick = () => {
    closeMenu();
    setDropdownVisible(false);
  };

  const displayLinks = () => {
    if (collections && collectionIds) {
      return collectionIds.map((collectionId) => {
        const firstCollection = collectionIds.indexOf(collectionId) === 0;
        return (
          <li
            className={firstCollection && menuVisible ? "max-lg:mt-2" : ""}
            key={collectionId}
          >
            <div>
              {firstCollection && menuVisible ? (
                <div className="bg-brand-dark-gray p-2 text-brand-white">
                  Art
                </div>
              ) : null}
              <NavLink
                className="hover:text-brand-red hover:underline focus:text-brand-red focus:underline max-lg:p-2"
                onClick={handleClick}
                to={`/art/${collectionId}`}
              >
                {collections[collectionId].name.toUpperCase()}
              </NavLink>
            </div>
          </li>
        );
      });
    }
    return null;
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const displayDropdown = () => {
    return (
      <ul className="absolute left-[-10px] top-10 w-[max-content] border-b-2 border-l-2 border-r-2 border-t-2 border-brand-red border-t-brand-dark-gray bg-brand-gray p-2">
        {displayLinks()}
      </ul>
    );
  };

  if (!menuVisible) {
    return (
      <li className="relative">
        <button
          className={`${
            viewingArt ? "text-brand-red" : null
          } hover:make-red focus:make-red flex items-center gap-2 hover:text-brand-red hover:underline focus:text-brand-red focus:underline`}
          onClick={toggleDropdown}
          type="button"
        >
          <img
            alt=""
            className={`${
              dropdownVisible ? "rotate-180" : null
            } h-[8px] transition-transform`}
            src={downIcon}
          />
          ART
        </button>
        {dropdownVisible ? displayDropdown() : null}
      </li>
    );
  }

  return displayLinks();
}
