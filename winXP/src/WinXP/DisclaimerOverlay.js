import React, { useState } from 'react';
import styled from 'styled-components';

import errorFallback from '../assets/windowsIcons/897(32x32).png';

/* Place your warning symbol image at: winXP/public/disclaimer-warning.png */
const WARNING_ICON = `${process.env.PUBLIC_URL || ''}/disclaimer-warning.png`;

const DISCLAIMER_MESSAGE = `This website is for creative purposes only. It does not hack, install malware, or perform any malicious actions. The code is open source—you may inspect it to verify.

By clicking OK, you acknowledge this disclaimer and agree to use this site at your own discretion.`;

function DisclaimerOverlay({ onAcknowledge }) {
  const [iconSrc, setIconSrc] = useState(WARNING_ICON);
  return (
    <Backdrop>
      <Dialog>
        <div className="disclaimer__top">
          <img
            src={iconSrc}
            alt="Warning"
            className="disclaimer__img"
            onError={() => setIconSrc(errorFallback)}
          />
          <div className="disclaimer__messages">
            {DISCLAIMER_MESSAGE.split('\n\n').map((para, i) => (
              <p key={i} className="disclaimer__message">
                {para}
              </p>
            ))}
          </div>
        </div>
        <div className="disclaimer__bottom">
          <div onClick={onAcknowledge} className="disclaimer__button">
            <span className="disclaimer__confirm">OK</span>
          </div>
        </div>
      </Dialog>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100000;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dialog = styled.div`
  background-color: #f5f5f5;
  width: 420px;
  max-width: 90vw;
  font-size: 11px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);

  .disclaimer__top {
    display: flex;
    flex: 1;
  }
  .disclaimer__img {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
  }
  .disclaimer__messages {
    padding: 2px 20px 12px;
  }
  .disclaimer__message {
    line-height: 16px;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .disclaimer__bottom {
    display: flex;
    width: 100%;
    justify-content: center;
  }
  .disclaimer__button {
    width: 80px;
    height: 22px;
    display: flex;
    border: 1px solid black;
    justify-content: center;
    align-items: center;
    box-shadow: inset -1px -1px 1px black;
    cursor: pointer;
    &:hover:active {
      box-shadow: inset 1px 1px 1px black;
      & > * {
        transform: translate(1px, 1px);
      }
    }
  }
  .disclaimer__confirm {
    line-height: 11px;
  }
`;

export default DisclaimerOverlay;
