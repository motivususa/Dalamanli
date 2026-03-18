import React, { useContext, useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [sortedChats, setSortedChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = async () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  useEffect(() => {
    setSortedChats((prevState) => {
      let notReady = false;
      Object.entries(chats).forEach((chat) => {
        if (!chat[1].date) notReady = true;
      });

      if (notReady) return prevState;

      return Object.entries(chats)?.sort((a, b) => {
        return b[1].date - a[1].date;
      });
    });
  }, [chats]);

  const handleSelect = async (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="aim-chats">
      {sortedChats.map((chat) => (
        <div
          className="aim-chats__friend"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <img
            className="aim-chats__profile-pic"
            src={chat[1].userInfo.photoURL}
            alt=""
          />
          <div className="aim-chat-preview">
            <p className="aim-chat-preview__name">{chat[1].userInfo.displayName}</p>
            <p
              className={`aim-chat-preview__latest ${
                chat[1].read === false && chat[1].lastMessage?.sender === "them"
                  ? "aim-unread"
                  : ""
              }`}
            >
              <span>
                {chat[1].lastMessage?.sender === "you" && "you: "}
                {chat[1].lastMessage?.text}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
