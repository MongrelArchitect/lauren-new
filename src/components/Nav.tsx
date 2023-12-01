import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@util/firebase";
import { CollectionsContext } from "@contexts/collections";
import { UserContext } from "@contexts/users";

import Blur from "./Blur";

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
          <li
            className={collectionIds.indexOf(collectionId) === 0 ? "mt-8" : ""}
            key={collectionId}
          >
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

  const logout = async () => {
    toggleMenu();
    try {
      await signOut(auth);
    } catch (err) {
      // XXX
      // handle better
      console.error(err);
    }
  };

  return (
    <nav className="flex items-center justify-between bg-red-200 p-2">
      <span>Lauren Mendelsohn-Bass</span>
      {menuVisible ? <Blur /> : null}
      <div
        className={`${
          menuVisible ? null : "translate-x-[110%]"
        } absolute right-0 top-0 flex h-[100svh] w-[50%] min-w-[200px] flex-col bg-white p-2 shadow-nav transition-transform`}
      >
        <button className="self-end" type="button">
          <img
            alt="menu"
            className="h-[40px]"
            onClick={toggleMenu}
            src={closeIcon}
          />
        </button>
        <ul className="flex flex-col gap-3 text-2xl">
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
          {displayCollections()}
          {user ? (
            <>
              <li className="mt-8">
                <NavLink onClick={toggleMenu} to="/dashboard">
                  DASHBOARD
                </NavLink>
              </li>
              <li>
                <button onClick={logout} type="button">
                  SIGN OUT
                </button>
              </li>
            </>
          ) : null}
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
