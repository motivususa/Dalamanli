import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = ({ onImageClick }) => {
  const [messages, setMessages] = useState();
  const [messageStatus, setMessageStatus] = useState();
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSubChats = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    const unSubUsers = onSnapshot(
      doc(db, "userChats", currentUser.uid),
      (document) => {
        if (document.data() && document.data()[data.chatId]) {
          setMessageStatus(document.data()[data.chatId].read);
          if (document.data()[data.chatId].lastMessage?.sender !== "you") {
            updateDoc(doc(db, "userChats", currentUser.uid), {
              [data.chatId + ".read"]: true,
            });

            updateDoc(doc(db, "userChats", data.user.uid), {
              [data.chatId + ".read"]: true,
            });
          }
        }
      }
    );

    return () => {
      unSubChats();
      unSubUsers();
    };
  }, [data.chatId, currentUser.uid, data.user.uid]);

  return (
    <div className="aim-messages">
      {messages?.map((m) => {
        if (m === messages[messages.length - 1]) {
          return (
            <Message
              message={m}
              key={m.id}
              messageStatus={messageStatus}
              lastMessage={true}
              onImageClick={onImageClick}
            />
          );
        }
        return <Message message={m} key={m.id} onImageClick={onImageClick} />;
      })}
    </div>
  );
};

export default Messages;
