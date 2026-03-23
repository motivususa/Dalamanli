import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { WINXP_LOGON_PROFILE_PHOTO_EVENT } from '../../constants/profilePhoto';
import { setWinXpSignedIn } from '../../constants/session';

const signupWindow = `${process.env.PUBLIC_URL}/retro-popups/assets/signup-window.png`;
const defaultPfp = `${process.env.PUBLIC_URL}/retro-popups/assets/default-pfp.jpg`;

function LogOn({ onClose, openApp }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' });
  const [pfpPreview, setPfpPreview] = useState(defaultPfp);
  const fileInputRef = useRef(null);

  useEffect(() => {
    function onProfilePhotoFromWebcam(e) {
      const url = e.detail?.dataUrl;
      if (typeof url === 'string' && url.startsWith('data:image/')) {
        setPfpPreview(url);
      }
    }
    window.addEventListener(WINXP_LOGON_PROFILE_PHOTO_EVENT, onProfilePhotoFromWebcam);
    return () =>
      window.removeEventListener(WINXP_LOGON_PROFILE_PHOTO_EVENT, onProfilePhotoFromWebcam);
  }, []);

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  function handlePfpChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setPfpPreview(URL.createObjectURL(file));
    } else {
      setPfpPreview(defaultPfp);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Supabase auth will hook in here later; local session for WinXP UI state
    setWinXpSignedIn();
    window.dispatchEvent(new CustomEvent('winxp-session-changed'));
    onClose();
  }

  return (
    <Div>
      {/* WinXP banner - exact image, no overlays */}
      <div className="banner">
        <img
          src={signupWindow}
          alt="Microsoft Windows XP Professional"
          className="banner-img"
        />
      </div>

      {/* Form body */}
      <div className="body">
        <form onSubmit={handleSubmit}>
          {mode === 'login' ? (
            <>
              <div className="field-row">
                <label><u>U</u>sername:</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={set('username')}
                  placeholder="username"
                  autoComplete="username"
                  autoFocus
                />
              </div>
              <div className="field-row">
                <label><u>P</u>assword:</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="password"
                  autoComplete="current-password"
                />
              </div>
            </>
          ) : (
            <>
              <div className="info-box">
                <p><strong>Join Kaya's World</strong></p>
                <p>Create an account to leave comments on the MySpace page, chat on AIM, and receive the newsletters.</p>
              </div>
              <div className="field-row">
                <label><u>N</u>ame:</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="name"
                  autoComplete="name"
                  autoFocus
                />
              </div>
              <div className="field-row">
                <label><u>U</u>sername:</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={set('username')}
                  placeholder="username"
                  autoComplete="username"
                />
              </div>
              <div className="field-row">
                <label><u>E</u>mail:</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="email"
                  autoComplete="email"
                />
              </div>
              <div className="field-row">
                <label><u>P</u>assword:</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="password"
                  autoComplete="new-password"
                />
              </div>
              <div className="field-row">
                <label><u>C</u>onfirm <u>p</u>assword:</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  placeholder="confirm password"
                  autoComplete="new-password"
                />
              </div>
              <div className="password-footnote-row">
                <div className="password-footnote-spacer" aria-hidden="true" />
                <p className="password-footnote" role="note">
                  <span className="password-footnote__mark">*</span>
                  Write down your password or keep it somewhere safe.{' '}
                  <strong>Forgot password</strong> is not available—we can&apos;t recover
                  your account if you lose it.
                </p>
              </div>
              <div className="field-row field-row--pfp">
                <label><u>P</u>rofile <u>p</u>icture:</label>
                <div className="pfp-column">
                  <div className="pfp-preview-row">
                    <button
                      type="button"
                      className="pfp-preview"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Choose profile picture file"
                    >
                      <img src={pfpPreview} alt="Profile preview" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePfpChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                  <p className="pfp-copy">
                    Upload an image from your computer, or take one in{' '}
                    <strong>WebCam Viewer</strong>.
                  </p>
                  <div className="pfp-btns">
                    <button
                      type="button"
                      className="xp-btn xp-btn--compact"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse…
                    </button>
                    <button
                      type="button"
                      className="xp-btn xp-btn--compact"
                      onClick={() => openApp && openApp('WebCam Viewer')}
                    >
                      Use webcam…
                    </button>
                  </div>
                  <p className="pfp-webcam-steps" role="note">
                    WebCam: connect → <strong>Capture</strong> → click the photo →{' '}
                    <strong>Use for sign-up</strong>.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Buttons - AIM messenger style (OK, Cancel, Sign Up...) */}
          <div className="btn-row">
            <span className="lang-badge">EN</span>
            <div className="btn-group">
              <button
                type="button"
                className="xp-btn"
                onClick={() => openApp && openApp('WelcomeToMyWindows')}
              >
                About
              </button>
              {mode === 'login' ? (
                <button type="submit" className="xp-btn">
                  Login
                </button>
              ) : (
                <button type="submit" className="xp-btn">
                  Create account
                </button>
              )}
              {mode === 'login' ? (
                <button
                  type="button"
                  className="xp-btn"
                  onClick={() => setMode('signup')}
                >
                  Sign Up...
                </button>
              ) : (
                <button
                  type="button"
                  className="xp-btn"
                  onClick={() => setMode('login')}
                >
                  Back
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Div>
  );
}

const Div = styled.div`
  width: 100%;
  height: 100%;
  background: #ece9d8;
  font-family: Tahoma, sans-serif;
  font-size: 11px;
  display: flex;
  flex-direction: column;

  /* ── Banner: exact image, no overlays ── */
  .banner {
    line-height: 0;
  }
  .banner img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  /* ── Body ── */
  .body {
    flex: 1;
    padding: 16px 18px 12px;
  }
  .info-box {
    background: #ddeeff;
    border: 1px solid #9ab8d8;
    padding: 7px 10px;
    margin-bottom: 12px;
    font-size: 10px;
    line-height: 1.5;
    p { margin: 0 0 3px; }
  }
  .field-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    label {
      flex: 0 0 auto;
      width: 100px;
      text-align: right;
      padding-right: 8px;
      white-space: nowrap;
      box-sizing: content-box;
    }
    input {
      flex: 1;
      height: 20px;
      padding: 0 3px;
      font-size: 11px;
      font-family: Tahoma, sans-serif;
      border: 1px solid #7f9db9;
      background: #fff;
      &:focus {
        outline: 1px solid #316ac5;
      }
    }
    &--pfp {
      align-items: flex-start;
      .pfp-column {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .pfp-preview-row {
        display: flex;
        align-items: center;
      }
      .pfp-preview {
        width: 48px;
        height: 48px;
        padding: 0;
        border: 1px solid #7f9db9;
        background: #fcfcfe;
        overflow: hidden;
        flex-shrink: 0;
        cursor: pointer;
        display: block;
        &:focus {
          outline: 1px solid #316ac5;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }
      }
      .pfp-copy,
      .pfp-webcam-steps {
        margin: 0;
        font-size: 10px;
        line-height: 1.4;
        color: #444;
      }
      .pfp-webcam-steps {
        color: #555;
        padding: 4px 6px;
        background: #f0eee6;
        border: 1px solid #d4d0c8;
      }
      .pfp-btns {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
    }
  }

  /* Same flex geometry as .field-row → matches input & .pfp-column width exactly */
  .password-footnote-row {
    display: flex;
    align-items: stretch;
    margin-bottom: 10px;
  }
  .password-footnote-spacer {
    flex: 0 0 auto;
    width: 100px;
    padding-right: 8px;
    box-sizing: content-box;
  }
  .password-footnote {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 10px;
    line-height: 1.45;
    color: #4a4a4a;
    box-sizing: border-box;
    padding: 6px 8px;
    text-align: left;
    text-wrap: pretty;
    background: #f7f5ef;
    border: 1px solid #d4d0c8;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }
  .password-footnote__mark {
    color: #8b0000;
    font-weight: bold;
    margin-right: 2px;
  }

  /* ── Buttons (AIM messenger style) ── */
  .btn-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    border-top: 1px solid #aca899;
    padding-top: 10px;
  }
  .lang-badge {
    background: #1f5fa6;
    color: #fff;
    font-size: 10px;
    font-weight: bold;
    padding: 1px 4px;
    border: 1px solid #0d3e7a;
  }
  .btn-group {
    display: flex;
    gap: 6px;
  }
  .xp-btn--compact {
    min-width: 0;
    height: 21px;
    font-size: 10px;
    padding: 0 8px;
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
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.6);
    &:hover {
      background: linear-gradient(to bottom, #eef4ff 0%, #d9e8f9 100%);
      border-color: #316ac5;
    }
    &:active {
      background: linear-gradient(to bottom, #d5e3f5 0%, #c4d8f0 100%);
      box-shadow: inset 1px 1px 2px rgba(0,0,0,0.15);
    }
  }
`;

export default LogOn;
