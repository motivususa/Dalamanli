import React, { useContext, useState, useRef } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const defaultPfp = `${process.env.PUBLIC_URL}/retro-popups/assets/default-pfp.jpg`;
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import useQuerydb from "../hooks/use-querydb";
import { ErrorContext } from "../context/ErrorContext";

const Register = ({ onSwitchToLogin }) => {
  const { setError, setLoading } = useContext(ErrorContext);
  const [pfpPreview, setPfpPreview] = useState(defaultPfp);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordConfirmInput, setPasswordConfirmInput] = useState("");
  const fileInputRef = useRef(null);
  const { performQuery } = useQuerydb();

  const handlePasswordInput = (e) => {
    setPasswordInput(e.target.value.replaceAll(" ", ""));
  };

  const handlePasswordConfirmInput = (e) => {
    setPasswordConfirmInput(e.target.value.replaceAll(" ", ""));
  };

  function handlePfpChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setPfpPreview(URL.createObjectURL(file));
    } else {
      setPfpPreview(defaultPfp);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value.trim();
    const email = e.target[1].value.trim();
    const password = e.target[2].value;
    const passwordConfirm = e.target[3].value;
    const file = fileInputRef.current?.files?.[0];

    try {
      setLoading({ value: 10, message: "validating user details" });
      if (!displayName) throw new Error("Username cannot be empty.");
      if (displayName.length > 16)
        throw new Error("Username cannot be longer than 16 characters.");

      await performQuery({
        dbCollection: "userNames",
        dbField: "userName",
        dbOperator: "==",
        dbMatch: displayName.toLowerCase(),
        handleQuery: () => {
          throw new Error("This username is already in use.");
        },
      });

      if (!email) throw new Error("Email cannot be empty.");

      if (!password) throw new Error("Password cannot be empty.");
      if (password.length < 6)
        throw new Error(
          "Password must be longer than 6 characters, no spaces allowed."
        );
      if (password !== passwordConfirm)
        throw new Error("Passwords do not match.");
      if (!file) throw new Error("Please use an image.");
      if (file.size / 1024 / 1024 > 1) {
        throw new Error("Image size is too big! Maximum: 1MB.");
      }

      setLoading({ value: 20, message: "authenticating account" });

      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, `userProfiles/${displayName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setLoading({ value: 40, message: "uploading image" });

      await uploadTask;

      setLoading({ value: 60, message: "adding to list of users" });

      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      await updateProfile(res.user, {
        displayName,
        photoURL: downloadURL,
      });

      setLoading({ value: 80, message: "creating account details" });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        displayNameLower: displayName.toLowerCase(),
        photoURL: downloadURL,
      });

      await setDoc(doc(db, "userNames", res.user.uid), {
        userName: displayName.toLowerCase(),
      });

      setLoading({ value: 100, message: "finalizing account creation" });

      await setDoc(doc(db, "userChats", res.user.uid), {});

      setLoading(false);
    } catch (err) {
      setLoading(false);

      if (err.message === "Firebase: Error (auth/email-already-in-use).") {
        setError("This email is already in use.");
      } else {
        setError(err.message.replace("Error: ", ""));
      }

      console.error(err);
    }
  };

  return (
    <div className="aim-register">
      <h2 className="aim-register__title">Register An Account:</h2>
      <form className="aim-register__form" onSubmit={handleSubmit}>
        <div className="aim-register__field">
          <label htmlFor="aim-name">Username</label>
          <input
            autoComplete="off"
            id="aim-name"
            type="text"
            placeholder="username"
          />
        </div>

        <div className="aim-register__field">
          <label htmlFor="aim-email">Email</label>
          <input type="email" placeholder="email" autoComplete="email" />
        </div>

        <div className="aim-register__field">
          <label htmlFor="aim-password">Password</label>
          <input
            onChange={handlePasswordInput}
            value={passwordInput}
            id="aim-password"
            type="password"
            placeholder="password"
          />
        </div>

        <div className="aim-register__field">
          <label htmlFor="aim-passwordConfirm">Confirm</label>
          <input
            onChange={handlePasswordConfirmInput}
            value={passwordConfirmInput}
            id="aim-passwordConfirm"
            type="password"
            placeholder="confirm password"
          />
        </div>

        <div className="aim-register__field aim-register__field--pfp">
          <label>Profile picture:</label>
          <label className="aim-register__pfp-upload">
            <div
              className="aim-register__pfp-preview"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            >
              <img src={pfpPreview} alt="Profile" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              id="aim-register-file"
              accept="image/*"
              onChange={handlePfpChange}
              style={{ display: "none" }}
            />
            <span className="aim-register__pfp-hint">Click to upload</span>
          </label>
        </div>
        <button className="aim-register__submit" type="submit">Sign Up</button>
      </form>
      <p className="aim-register__existing">
        You already have an account?{" "}
        <span className="aim-link" onClick={onSwitchToLogin}>
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;
