import React, { useContext } from 'react';
import { AuthContext, AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { ErrorContextProvider } from './context/ErrorContext';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import './aim.css';

function AIMInner({ onClose, openApp }) {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="aim-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="aim-container" style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
        <p style={{ fontSize: '12px', fontFamily: 'Tahoma, sans-serif' }}>Please log on to Windows to use AIM.</p>
        <button
          style={{ fontSize: '12px', padding: '4px 16px', cursor: 'pointer' }}
          onClick={() => openApp && openApp('LogOn')}
        >
          Log On...
        </button>
      </div>
    );
  }

  return (
    <ChatContextProvider>
      <div className="aim-container">
        <Sidebar />
        <Chat />
      </div>
    </ChatContextProvider>
  );
}

function AIM(props) {
  return (
    <ErrorContextProvider>
      <AuthContextProvider>
        <AIMInner {...props} />
      </AuthContextProvider>
    </ErrorContextProvider>
  );
}

export default AIM;
