import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const UserBar = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const logoutUser = () => {
    signOut(auth);
    dispatch({ type: "REMOVE_USER" });
  };

  return (
    <div className="aim-userbar">
      <div className="aim-user">
        <img className="aim-user__profile-pic" src={currentUser.photoURL} alt="" />
        <div className="aim-user__details">
          <p className="aim-user__name">{currentUser.displayName}</p>
          <p className="aim-user__email">{`<${currentUser.email}>`}</p>
          <button className="aim-user__logout" onClick={logoutUser}>
            logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserBar;
