import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import PersonImage from "../assets/images/person.png";
import { ChatContext } from "../context/ChatContext";

const Chat = ({ onImageClick }) => {
  const { data } = useContext(ChatContext);

  return (
    <div className="aim-chat">
      {data.user?.displayName ? (
        <>
          <div className="aim-sender">
            <img className="aim-sender__icon" src={PersonImage} alt="" />
            <p className="aim-sender__name">To: {data.user?.displayName}</p>
          </div>
          <Messages onImageClick={onImageClick} />
          <Input />
        </>
      ) : (
        <p className="aim-chat__no-sender">No user selected</p>
      )}
    </div>
  );
};

export default Chat;
