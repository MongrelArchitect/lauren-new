import { useState } from "react";

import closeIcon from "@assets/icons/close.svg";
import menuIcon from "@assets/icons/menu.svg";

export default function Nav() {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <nav className="flex justify-end bg-red-200">
      <div
        className={`${
          menuVisible ? null : "-translate-x-full"
        } absolute left-0 top-0 h-[100svh] min-w-[200px] bg-blue-200 p-2 transition-transform`}
      >
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
          src={menuVisible ? closeIcon : menuIcon}
        />
      </button>
    </nav>
  );
}
