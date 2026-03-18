import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";

// Lazy-load firebase to avoid initialization errors
let authInstance = null;
const getAuth = async () => {
  if (!authInstance) {
    const { auth } = await import('./apps/AIM/firebase');
    authInstance = auth;
  }
  return authInstance;
};

export const GlobalAuthContext = createContext({
  currentUser: null,
  loading: true,
});

export const GlobalAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => {};
    getAuth()
      .then((auth) => {
        unsub = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
          setLoading(false);
        });
      })
      .catch((err) => {
        console.error('Firebase auth init error:', err);
        setLoading(false);
      });

    return () => unsub();
  }, []);

  return (
    <GlobalAuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </GlobalAuthContext.Provider>
  );
};

export const useGlobalAuth = () => useContext(GlobalAuthContext);
