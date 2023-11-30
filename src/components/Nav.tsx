import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { CollectionsContext } from "@contexts/collections";
import { UserContext } from "@contexts/users";

import closeIcon from "@assets/icons/close.svg";
import menuIcon from "@assets/icons/menu.svg";

export default function Nav() {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const collections = useContext(CollectionsContext);
  const collectionIds = collections ? Object.keys(collections) : null;
  if (collections && collectionIds) {
    collectionIds.sort((a, b) => {
      return collections[a].name.localeCompare(collections[b].name);
    });
  }

  const displayCollections = () => {
    if (collections && collectionIds) {
      return collectionIds.map((collectionId) => {
        return (
          <li key={collectionId}>
            <NavLink onClick={toggleMenu} to={`/art/${collectionId}`}>
              {collections[collectionId].name.toUpperCase()}
            </NavLink>
          </li>
        );
      });
    }
    return null;
  };

  const user = useContext(UserContext);

  return (
    <nav className="flex items-center justify-between bg-red-200 p-2">
      <span>Lauren Mendelsohn-Bass</span>
      <div
        className={`${
          menuVisible ? null : "translate-x-full"
        } absolute right-0 top-0 flex h-[100svh] min-w-[200px] flex-col bg-blue-200 p-2 transition-transform`}
      >
        <button className="self-end" type="button">
          <img
            alt="menu"
            className="h-[40px]"
            onClick={toggleMenu}
            src={closeIcon}
          />
        </button>
        <ul>
          <li>
            <NavLink onClick={toggleMenu} to="/">
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink onClick={toggleMenu} to="/profile">
              PROFILE
            </NavLink>
          </li>
          <li>
            <NavLink onClick={toggleMenu} to="/press">
              PRESS
            </NavLink>
          </li>
          <li>
            <NavLink onClick={toggleMenu} to="/contact">
              CONTACT
            </NavLink>
          </li>
          {user ? (
            <li>
              <NavLink onClick={toggleMenu} to="/dashboard">
                DASHBOARD
              </NavLink>
            </li>
          ) : null}
          {displayCollections()}
        </ul>
      </div>
      <button type="button">
        <img
          alt="menu"
          className="h-[40px]"
          onClick={toggleMenu}
          src={menuIcon}
        />
      </button>
    </nav>
  );
}
