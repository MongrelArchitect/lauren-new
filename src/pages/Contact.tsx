import { Link } from "react-router-dom";
import contactImage from "@assets/images/contact.jpg";

export default function Contact() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h1 className="text-3xl">Contact</h1>
      <p className="text-xl flex gap-1">
        email:
        <Link className="text-brand-red hover:underline" to="mailto:lmbass@roadrunner.com">lmbass@roadrunner.com</Link>
      </p>
      <img
        alt=""
        className="w-full border-2 border-brand-red p-2"
        src={contactImage}
      />
    </div>
  );
}
