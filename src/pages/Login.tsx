import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "@contexts/users";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@util/firebase";

export default function Login() {
  const user = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

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
          message = "Incorrect email or password";
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
    <div className="flex w-full flex-col gap-2">
      <h1 className="bg-brand-red p-2 text-3xl text-brand-white">Login</h1>
      <form className="flex w-full max-w-[400px] flex-col gap-3 p-2 text-xl">
        <div className="flex flex-col gap-1">
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
            value={formInfo.email || ""}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password:</label>
          <input
            name="password"
            id="password"
            onChange={handleChange}
            className={`${
              attempted
                ? "invalid:border-brand-red invalid:text-brand-red invalid:outline invalid:outline-brand-red invalid:focus:border-brand-red focus:invalid:outline-brand-red"
                : null
            } border-2 border-black p-2 focus:border-brand-blue focus:outline focus:outline-brand-blue`}
            required
            type="password"
            value={formInfo.password || ""}
          />
        </div>
        <button
          className="border-2 border-black bg-brand-blue p-2 text-brand-white"
          onClick={attemptLogin}
          type="button"
        >
          Submit
        </button>
        <Link className="text-brand-red hover:underline" to="/forgot">
          Forgot password?
        </Link>
        {attempted && error ? (
          <div className="bg-brand-red p-2 text-brand-white">{error}</div>
        ) : null}
      </form>
    </div>
  );
}
