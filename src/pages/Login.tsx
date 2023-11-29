import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@util/firebase";

export default function Login() {
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [formInfo, setFormInfo] = useState({
    email: "",
    password: "",
  });
  const [formValidity, setFormValidity] = useState({
    email: false,
    password: false,
  });

  const attemptLogin = async () => {
    setAttempted(true);
    if (Object.values(formValidity).includes(false)) {
      // some value is invalid
      setError("Invalid info - check each field");
    } else {
      try {
        await signInWithEmailAndPassword(
          auth,
          formInfo.email,
          formInfo.password,
        );
      } catch (err) {
        let message = "Unknown error";
        if (err instanceof Error) message = err.message;
        if (message === "Firebase: Error (auth/invalid-credential).")
          message = "Invalid email or password";
        setError(message);
      }
    }
  };

  const handleChange = (event: React.SyntheticEvent) => {
    setError(null);
    const target = event.target as HTMLInputElement;
    if (target.name === "email") {
      setFormInfo((prevState) => {
        return {
          ...prevState,
          email: target.value,
        };
      });
      setFormValidity((prevState) => {
        return {
          ...prevState,
          email: target.validity.valid,
        };
      });
    }
    if (target.name === "password") {
      setFormInfo((prevState) => {
        return {
          ...prevState,
          password: target.value,
        };
      });
      setFormValidity((prevState) => {
        return {
          ...prevState,
          password: target.validity.valid,
        };
      });
    }
  };

  return (
    <main>
      <form className="flex flex-col items-start gap-1">
        <h1>Login</h1>
        <label htmlFor="email">Email:</label>
        <input
          name="email"
          id="email"
          onChange={handleChange}
          className="rounded-md border-2 border-black p-1"
          required
          type="email"
          value={formInfo.email || ""}
        />
        <label htmlFor="passowrd">Password:</label>
        <input
          name="password"
          id="password"
          onChange={handleChange}
          className="rounded-md border-2 border-black p-1"
          required
          type="password"
          value={formInfo.password || ""}
        />
        <button
          className="rounded-md border-2 border-black p-1"
          onClick={attemptLogin}
          type="button"
        >
          Submit
        </button>
        {attempted && error ? <div className="bg-red-300">{error}</div> : null}
      </form>
    </main>
  );
}
