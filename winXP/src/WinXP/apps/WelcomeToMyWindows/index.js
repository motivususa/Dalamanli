import React from 'react';
import styled from 'styled-components';

import windowsLogo from '../../../assets/windowsIcons/windows-off.png';

function WelcomeToMyWindows({ onClose, onForceClose, openApp, showCloseHint, closeHint }) {
  return (
    <Div>
      {/* Blue header - Windows XP Welcome style */}
      <div className="welcome-header">
        <img src={windowsLogo} alt="" className="welcome-logo" />
        <div className="welcome-branding">
          <span className="brand-main">Kaya&apos;s Windows</span>
          <span className="brand-tagline">Welcome to my site</span>
        </div>
        <span className="welcome-copyright">© 2025 Kaya Wesley</span>
      </div>

      {/* Orange separator */}
      <div className="welcome-separator" />

      {/* White body - intro content */}
      <div className="welcome-body">
        <div className="welcome-content">
          <p>
            <strong>Welcome! This is my Windows XP–themed portfolio website.</strong>
          </p>
          <p>
            To interact with me or use most of the app&apos;s cool features, you&apos;ll need to create an account.
            You&apos;ll get access to:
          </p>
          <ul>
            <li>My MySpace page — see yourself on the list of my friends, add comments, interact with my posts, and more</li>
            <li>AIM — chat on AOL Instant Messenger (yes, from years ago!)</li>
            <li>Newsletters — all things me and the latest of what I&apos;m doing</li>
          </ul>
          <p>
            Enjoy my new website! Browse around, listen to some music, play Minesweeper, use Notepad for your thoughts,
            or use Paint to get creative. For more social links besides MySpace, click on My Computer.
          </p>
        </div>
        <div className="welcome-actions">
          {showCloseHint && closeHint && (
            <div className="welcome-hint">
              <span className="welcome-hint__icon">i</span>
              <div className="welcome-hint__content">
                <span className="welcome-hint__title">{closeHint}:</span>
                <span className="welcome-hint__body"> to continue</span>
              </div>
            </div>
          )}
          <button
            type="button"
            className="xp-btn"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('welcome-complete'));
              openApp?.('LogOn');
              onForceClose?.();
            }}
          >
            Next
          </button>
        </div>
      </div>
    </Div>
  );
}

const Div = styled.div`
  width: 100%;
  height: 100%;
  min-height: 320px;
  font-family: Tahoma, sans-serif;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  background: #ede9d8;

  .welcome-header {
    padding: 16px 20px;
    background: linear-gradient(
      to right,
      #1e5dbb 0%,
      #2a6dc7 20%,
      #3a7fd6 50%,
      #4a8ee0 100%
    );
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
  }

  .welcome-logo {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    filter: brightness(1.1);
    object-fit: contain;
  }

  .welcome-branding {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .brand-main {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    letter-spacing: 0.5px;
  }

  .brand-tagline {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.9);
  }

  .welcome-copyright {
    position: absolute;
    bottom: 8px;
    left: 84px;
    font-size: 9px;
    color: rgba(255, 255, 255, 0.7);
  }

  .welcome-separator {
    height: 3px;
    background: linear-gradient(to right, #f7941d 0%, #f9a63c 50%, #f7941d 100%);
  }

  .welcome-body {
    flex: 1;
    padding: 16px 20px 20px;
    background: #ede9d8;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
  }

  .welcome-content {
    flex: 1;
    line-height: 1.6;
    color: #000;

    p {
      margin: 0 0 10px;
    }

    ul {
      margin: 8px 0 12px;
      padding-left: 20px;

      li {
        margin-bottom: 6px;
      }
    }
  }

  .welcome-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    padding-top: 8px;
    border-top: 1px solid #aca899;
  }

  .welcome-hint {
    position: relative;
    background: #ffffe1;
    border: 1px solid #000;
    border-radius: 4px;
    padding: 8px 10px 10px;
    font-size: 11px;
    font-family: Tahoma, 'Segoe UI', sans-serif;
    color: #1a1a1a;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    min-width: 160px;
    box-shadow: 2px 2px 6px rgba(0,0,0,0.25);
  }
  .welcome-hint::before {
    content: '';
    position: absolute;
    top: 100%;
    right: 24px;
    border: 6px solid transparent;
    border-top-color: #000;
  }
  .welcome-hint::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 25px;
    border: 5px solid transparent;
    border-top-color: #ffffe1;
  }
  .welcome-hint__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    min-width: 18px;
    background: #316ac5;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    font-style: italic;
    border-radius: 50%;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 1px rgba(0,0,0,0.2);
  }
  .welcome-hint__content {
    line-height: 1.4;
  }
  .welcome-hint__title {
    font-weight: 600;
    color: #1a1a1a;
  }
  .welcome-hint__body {
    color: #333;
  }

  .xp-btn {
    min-width: 72px;
    height: 23px;
    font-family: Tahoma, sans-serif;
    font-size: 11px;
    padding: 0 10px;
    cursor: pointer;
    background: linear-gradient(to bottom, #fff 0%, #ece9d8 100%);
    border: 1px solid #7f9db9;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6);
    outline: 1px dotted #000;
    outline-offset: -2px;

    &:hover {
      background: linear-gradient(to bottom, #eef4ff 0%, #d9e8f9 100%);
      border-color: #316ac5;
    }

    &:active {
      background: linear-gradient(to bottom, #d5e3f5 0%, #c4d8f0 100%);
      box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.15);
    }
  }
`;

export default WelcomeToMyWindows;
