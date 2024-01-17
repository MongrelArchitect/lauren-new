import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@util/firebase";
import { UserContext } from "@contexts/users";

import Blur from "./Blur";
import CollectionLinks from "./CollectionLinks";

import closeIcon from "@assets/icons/close.svg";
import menuIcon from "@assets/icons/menu.svg";

export default function Nav() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    // for the edge-case where the browser window is being resized when the
    // nav sidebar is open, which could screw up full-width gallery dropdowns
    window.addEventListener("resize", () => {
      setMenuVisible(false);
    });
  }, []);

  const closeMenu = () => {
    setMenuVisible(false);
    setDropdownVisible(false);
  };

  const openMenu = () => {
    setMenuVisible(true);
  };

  const user = useContext(UserContext);

  const logout = async () => {
    closeMenu();
    try {
      await signOut(auth);
    } catch (err) {
      // XXX
      // handle better
      console.error(err);
    }
  };

  const displayLinks = () => {
    return (
      <ul className="flex gap-4 text-2xl max-lg:flex-col">
        <li>
          <NavLink
            className="hover:border-b-2 hover:border-active hover:text-active"
            onClick={closeMenu}
            to="/"
          >
            HOME
          </NavLink>
        </li>
        <CollectionLinks
          dropdownVisible={dropdownVisible}
          setDropdownVisible={setDropdownVisible}
          menuVisible={menuVisible}
          closeMenu={closeMenu}
        />
        <li className="max-lg:mt-8">
          <NavLink
            className="hover:border-b-2 hover:border-active hover:text-active"
            onClick={closeMenu}
            to="/profile"
          >
            PROFILE
          </NavLink>
        </li>
        <li>
          <NavLink
            className="hover:border-b-2 hover:border-active hover:text-active"
            onClick={closeMenu}
            to="/press"
          >
            PRESS
          </NavLink>
        </li>
        <li>
          <NavLink
            className="hover:border-b-2 hover:border-active hover:text-active"
            onClick={closeMenu}
            to="/contact"
          >
            CONTACT
          </NavLink>
        </li>
        {user ? (
          <>
            <li className="max-lg:mt-8">
              <NavLink
                className="hover:border-b-2 hover:border-active hover:text-active"
                onClick={closeMenu}
                to="/dashboard"
              >
                DASHBOARD
              </NavLink>
            </li>
            <li>
              <button
                className="hover:text-active hover:underline"
                onClick={logout}
                type="button"
              >
                SIGN OUT
              </button>
            </li>
          </>
        ) : null}
      </ul>
    );
  };

  const displayFullMenu = () => {
    return <div className="hidden lg:flex">{displayLinks()}</div>;
  };

  const displaySidebar = () => {
    return (
      <div className="lg:hidden">
        {menuVisible ? <Blur close={closeMenu} /> : null}
        <div
          className={`${
            menuVisible ? null : "translate-x-[110%]"
          } fixed right-0 top-0 z-30 flex h-[100svh] min-w-[200px] flex-col border-l-2 border-active bg-white p-2 transition-transform`}
        >
          <button className="self-end" onClick={closeMenu} type="button">
            <img alt="menu" className="red-icon h-[40px]" src={closeIcon} />
          </button>
          {displayLinks()}
        </div>
      </div>
    );
  };

  return (
    <nav className="max-w-[1000px] sticky top-0 z-20 flex w-full items-center justify-between border-b-2 border-active bg-white p-2">
      <span className="text-xl">Lauren Mendelsohn-Bass</span>
      {displaySidebar()}
      {displayFullMenu()}
      <button
        className="lg:hidden"
        onClick={openMenu}
        tabIndex={1}
        type="button"
      >
        <img alt="menu" className="red-icon h-[40px]" src={menuIcon} />
      </button>
    </nav>
  );
}
