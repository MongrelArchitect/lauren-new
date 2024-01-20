import { useEffect } from "react";
import { Link } from "react-router-dom";

import contactImage from "@assets/images/contact.jpg";

export default function Contact() {
  useEffect(() => {
    document.title = "Lauren Mendelsohn-Bass | Contact";
  }, []);

  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="bg-brand-red p-2 text-3xl text-brand-white">Contact</h1>
      <p className="flex gap-1 text-xl">
        email:
        <Link
          className="text-brand-red hover:underline"
          to="mailto:lmbass@roadrunner.com"
        >
          lmbass@roadrunner.com
        </Link>
      </p>
      <img
        alt=""
        className="w-full border-2 border-brand-red p-2"
        src={contactImage}
      />
    </div>
  );
}
