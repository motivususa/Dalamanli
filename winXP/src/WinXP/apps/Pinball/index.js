import React from 'react';
import styled from 'styled-components';

function Pinball({ onClose }) {
  return (
    <Div>
      <div className="pinball__content">
        <p>3D Pinball - Space Cadet</p>
        <p className="pinball__sub">(Placeholder - Pinball game coming soon)</p>
      </div>
    </Div>
  );
}

const Div = styled.div`
  background-color: #1a1a2e;
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  .pinball__content {
    text-align: center;
  }
  .pinball__sub {
    font-size: 11px;
    color: #888;
    margin-top: 8px;
  }
`;

export default Pinball;
