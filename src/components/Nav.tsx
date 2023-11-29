import { useState } from "react";

import closeIcon from "@assets/icons/close.svg";
import menuIcon from "@assets/icons/menu.svg";

export default function Nav() {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

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
          <li>POP FICTION</li>
          <li>CANDY</li>
          <li>FUN &amp; GAMES</li>
          <li>FAIRY TALES</li>
          <li>CONTACT</li>
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
