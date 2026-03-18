import React, { useCallback, useContext, useEffect, useState } from "react";
import UserBar from "./UserBar";
import Search from "./Search";
import Chats from "./Chats";
import Requests from "./Requests";
import RequestCard from "./RequestCard";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const [friends, setFriends] = useState({});
  const [friendsLength, setFriendsLength] = useState(0);
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    const getFriendRequests = async () => {
      const unsub = onSnapshot(
        doc(db, "friendRequests", currentUser.uid),
        (doc) => {
          setFriends(doc.data());
        }
      );

      return () => {
        unsub();
      };
    };

    currentUser.uid && getFriendRequests();
  }, [currentUser.uid]);

  const handleClose = useCallback(() => {
    setShowRequests(false);
  }, []);

  useEffect(() => {
    if (friends) {
      const numOfRequests = Object.entries(friends).filter(
        (friend) => friend[1].status === "requested"
      ).length;

      setFriendsLength(numOfRequests);

      if (numOfRequests <= 0) {
        handleClose();
      }
    }
  }, [friends, handleClose]);

  const handleRequestClicked = () => {
    setShowRequests(true);
  };

  return (
    <div className="aim-sidebar">
      <Search />
      {friends && friendsLength > 0 && (
        <Requests onClick={handleRequestClicked} friends={friendsLength} />
      )}
      {showRequests && friends && (
        <div className="aim-requests-list">
          <div className="aim-requests-list__header">
            <span>Friend Requests</span>
            <button onClick={handleClose}>X</button>
          </div>
          <div className="aim-requests-list__body">
            {Object.entries(friends).map((friend) => {
              if (friend[1].status === "requested") {
                return (
                  <RequestCard key={friend[0]} friendUID={friend[0]} />
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
      <Chats />
      <UserBar />
    </div>
  );
};

export default Sidebar;
