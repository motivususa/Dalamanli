import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

try {
  TimeAgo.addLocale(en);
} catch (e) {
  // Locale already added
}
const timeAgo = new TimeAgo("en-US");

const Message = ({ message, messageStatus, lastMessage, onImageClick }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      className={`aim-message ${
        message.senderId === currentUser.uid
          ? "aim-message--owner"
          : "aim-message--sender"
      }`}
    >
      <div className="aim-message__row">
        <div className="aim-message__info">
          <img
            className="aim-message__profile-pic"
            src={
              message.senderId === currentUser.uid
                ? currentUser.photoURL
                : data.user.photoURL
            }
            alt=""
          />
        </div>
        <div className="aim-message__content">
          {message.text && <p className="aim-message__text">{message.text}</p>}
          {message.img && (
            <img
              onClick={() => onImageClick && onImageClick(message.img)}
              className="aim-message__image"
              src={message.img}
              alt=""
            />
          )}
        </div>
      </div>
      <p className="aim-message__time">
        {timeAgo.format(new Date(message.date.seconds * 1000))}
        {message.senderId === currentUser.uid && lastMessage
          ? ` - ${messageStatus ? "Read" : "Delivered"}`
          : ""}
      </p>
      <div className="aim-message__bottom" ref={ref}></div>
    </div>
  );
};

export default Message;
