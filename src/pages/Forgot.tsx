import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@util/firebase";

export default function Forgot() {
  const [attempted, setAttempted] = useState(false);
  const [email, setEmail] = useState({
    value: "",
    valid: false,
  });
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (event: React.SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    setError(null);
    setEmail({
      value: target.value,
      valid: target.validity.valid,
    });
  };

  const submit = async () => {
    setAttempted(true);
    if (!email.valid) {
      setError("Invalid email");
    } else {
      try {
        // XXX
        // send email
        await sendPasswordResetEmail(auth, email.value);
        setSuccess(true);
      } catch (err) {
        console.log(err);
        let message = "Unknown error";
        if (err instanceof Error) message = err.message;
        if (message === "Firebase: Error (auth/invalid-email).")
          message = "Invalid email";
        setError(message);
      }
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="text-3xl">Password Reset</h1>
      <form className="flex w-full max-w-[400px] flex-col gap-3 p-2 text-xl">
        <div className="flex flex-col gap-1">
          <p>Enter email to request a new password.</p>
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            id="email"
            onChange={handleChange}
            className={`${
              attempted
                ? "invalid:border-brand-red invalid:text-brand-red invalid:outline invalid:outline-brand-red invalid:focus:border-brand-red focus:invalid:outline-brand-red"
                : null
            } border-2 border-black p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue`}
            required
            type="email"
            value={email.value || ""}
          />
        </div>

        <button
          className="border-2 border-black bg-brand-blue p-2 text-brand-white"
          onClick={submit}
          type="button"
        >
          Submit
        </button>

        {attempted && error ? (
          <div className="bg-brand-red p-2 text-brand-white">{error}</div>
        ) : null}

        {attempted && success ? (
          <div className="bg-brand-blue p-2 text-brand-white">
            Success - please check email for password reset link.
          </div>
        ) : null}

      </form>
    </div>
  );
}
