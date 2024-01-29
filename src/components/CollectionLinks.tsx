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

  const determineTabindex = (inDropdown?: boolean) => {
    if (inDropdown) {
      if (dropdownVisible) {
        return 0;
      }
      return -1;
    } else if (menuVisible) {
      return 0;
    }
    return -1;
  };

  const displayLinks = (inDropdown?: boolean) => {
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
                tabIndex={determineTabindex(inDropdown)}
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
      <ul
        aria-label="Art links"
        className={`${
          dropdownVisible ? "" : "-translate-y-[150%]"
        } absolute left-[12px] top-10 -z-10 flex w-[max-content] flex-col gap-2 border-b-2 border-l-2 border-r-2 border-t-2 border-brand-red border-t-brand-dark-gray bg-brand-gray p-2 transition-transform duration-300 ease-in-out`}
        id="art-links"
      >
        {displayLinks(true)}
      </ul>
    );
  };

  if (!menuVisible) {
    return (
      <li className="relative">
        <button
          aria-controls="art-links"
          aria-expanded={dropdownVisible ? "true" : "false"}
          aria-label="Open art links"
          className={`${
            viewingArt ? "text-brand-red" : null
          } hover:make-red focus:make-red flex items-center gap-2 hover:text-brand-red hover:underline focus:text-brand-red focus:underline`}
          onClick={toggleDropdown}
          title="Open art links"
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
        {displayDropdown()}
      </li>
    );
  }

  return displayLinks();
}
