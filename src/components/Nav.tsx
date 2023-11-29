import { useContext, useState } from "react";
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

  const displayCollections = () => {
    if (collections) {
      return collections.map((collection) => {
        return (
          <li key={collection.id}>
            {collection.name.toUpperCase()}
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
          <li>HOME</li>
          <li>PROFILE</li>
          <li>PRESS</li>
          <li>CONTACT</li>
          {user ? <li>DASHBOARD</li> : null}
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
