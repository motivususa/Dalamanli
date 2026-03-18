import React from 'react';

const AIM_URL = process.env.REACT_APP_AIM_URL || 'http://localhost:3001';

function AIM({ onClose }) {
  return (
    <iframe
      src={AIM_URL}
      title="AIM"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block',
      }}
    />
  );
}

export default AIM;
