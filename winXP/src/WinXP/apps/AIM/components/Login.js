import React, { useContext } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { ErrorContext } from "../context/ErrorContext";

const Login = ({ onSwitchToRegister }) => {
  const { setError } = useContext(ErrorContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Invalid credentials, please try again.");
      console.error(err);
    }
  };

  return (
    <div className="aim-login">
      <h2 className="aim-login__title">Login:</h2>
      <form className="aim-login__form" onSubmit={handleSubmit}>
        <input type="email" placeholder="email" />
        <input type="password" placeholder="password" />
        <button type="submit">Login</button>
      </form>
      <p className="aim-login__register">
        Don't have an account?{" "}
        <span className="aim-link" onClick={onSwitchToRegister}>
          Register
        </span>
      </p>
    </div>
  );
};

export default Login;
