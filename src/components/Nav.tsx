import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
      <ul
        aria-label="Navigation menu"
        className={`${
          menuVisible ? "" : "max-lg:hidden"
        } flex gap-2 text-2xl max-lg:min-h-[100lvh] max-lg:flex-col max-lg:overflow-auto lg:gap-4 lg:p-2`}
        id="nav-links"
      >
        <CollectionLinks
          dropdownVisible={dropdownVisible}
          setDropdownVisible={setDropdownVisible}
          menuVisible={menuVisible}
          closeMenu={closeMenu}
        />
        <li className="max-lg:mt-8">
          {menuVisible ? (
            <div className="bg-brand-dark-gray p-2 text-brand-white">Info</div>
          ) : null}
          <NavLink
            className="hover:text-brand-red hover:underline focus:text-brand-red focus:underline max-lg:p-2"
            onClick={closeMenu}
            to="/profile"
          >
            PROFILE
          </NavLink>
        </li>
        <li>
          <NavLink
            className="hover:text-brand-red hover:underline focus:text-brand-red focus:underline max-lg:p-2"
            onClick={closeMenu}
            to="/press"
          >
            PRESS
          </NavLink>
        </li>
        <li>
          <NavLink
            className="hover:text-brand-red hover:underline focus:text-brand-red focus:underline max-lg:p-2"
            onClick={closeMenu}
            to="/contact"
          >
            CONTACT
          </NavLink>
        </li>
        {user ? (
          <>
            <li className="max-lg:mt-8">
              {menuVisible ? (
                <div className="bg-brand-dark-gray p-2 text-brand-white">
                  Admin
                </div>
              ) : null}
              <NavLink
                className="hover:text-brand-red hover:underline focus:text-brand-red focus:underline max-lg:p-2"
                onClick={closeMenu}
                to="/dashboard"
              >
                DASHBOARD
              </NavLink>
            </li>
            <li>
              <button
                className="hover:text-brand-red hover:underline focus:text-brand-red focus:underline max-lg:pl-2"
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
    return <div className="hidden bg-brand-gray lg:flex">{displayLinks()}</div>;
  };

  const displaySidebar = () => {
    return (
      <div className="lg:hidden">
        {menuVisible ? <Blur close={closeMenu} /> : null}
        <div
          className={`${
            menuVisible ? null : "translate-x-[110%]"
          } duration-400 fixed right-0 top-0 z-30 flex min-h-[100lvh] min-w-[200px] flex-col border-l-2 border-brand-red bg-brand-white transition-transform ease-in-out`}
        >
          <div className="flex w-full justify-end bg-brand-gray">
            <button
              aria-label="Close navigation menu"
              className={`${
                menuVisible ? "" : "hidden"
              } bg-brand-red hover:outline hover:outline-brand-black focus:outline focus:outline-brand-black`}
              onClick={closeMenu}
              tabIndex={menuVisible ? 0 : -1}
              title="Close navigation menu"
              type="button"
            >
              <img alt="" className="h-[40px] invert" src={closeIcon} />
            </button>
          </div>
          {displayLinks()}
        </div>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-20 flex w-full max-w-[1000px] flex-wrap items-center justify-between border-b-2 border-brand-red bg-brand-gray">
      <Link
        className="p-2 text-xl hover:text-brand-red hover:underline focus:text-brand-red focus:underline"
        to="/"
      >
        Lauren Mendelsohn-Bass
      </Link>
      {displaySidebar()}
      {displayFullMenu()}
      <button
        aria-controls="nav-links"
        aria-expanded={menuVisible ? "true" : "false"}
        aria-label="Open navigation menu"
        className={`${menuVisible ? "hidden" : ""} p-2 lg:hidden`}
        onClick={openMenu}
        title="Open navigation menu"
        type="button"
      >
        <img alt="menu" className="red-icon h-[24px] p-[2px]" src={menuIcon} />
      </button>
    </nav>
  );
}
