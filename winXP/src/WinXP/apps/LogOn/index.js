import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const signupWindow = `${process.env.PUBLIC_URL}/retro-popups/assets/signup-window.png`;
const defaultPfp = `${process.env.PUBLIC_URL}/retro-popups/assets/default-pfp.jpg`;

function LogOn({ onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [pfpPreview, setPfpPreview] = useState(defaultPfp);
  const fileInputRef = useRef(null);

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
    // Supabase auth will hook in here later
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
                <label>Email:</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="email"
                  autoFocus
                />
              </div>
              <div className="field-row">
                <label>Username:</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={set('username')}
                  placeholder="username"
                  autoComplete="username"
                />
              </div>
              <div className="field-row">
                <label>Name:</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="name"
                  autoComplete="name"
                />
              </div>
              <div className="field-row">
                <label>Password:</label>
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
                <p>Create an account to leave comments on the MySpace page, chat on AIM, and receive the newsletter.</p>
              </div>
              <div className="field-row">
                <label>Name:</label>
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
                <label>Username:</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={set('username')}
                  placeholder="username"
                  autoComplete="username"
                />
              </div>
              <div className="field-row">
                <label>Email:</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="email"
                  autoComplete="email"
                />
              </div>
              <div className="field-row">
                <label>Password:</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="password"
                  autoComplete="new-password"
                />
              </div>
              <div className="field-row field-row--pfp">
                <label>Profile picture:</label>
                <label className="pfp-upload">
                  <div className="pfp-preview" onClick={() => fileInputRef.current?.click()}>
                    <img src={pfpPreview} alt="Profile" />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePfpChange}
                    style={{ display: 'none' }}
                  />
                  <span className="pfp-hint">Click to upload</span>
                </label>
              </div>
            </>
          )}

          {/* Buttons - AIM messenger style (OK, Cancel, Sign Up...) */}
          <div className="btn-row">
            <span className="lang-badge">EN</span>
            <div className="btn-group">
              <button type="submit" className="xp-btn">
                {mode === 'login' ? 'OK' : 'Sign Up'}
              </button>
              <button type="button" className="xp-btn" onClick={onClose}>
                Cancel
              </button>
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
      width: 100px;
      text-align: right;
      padding-right: 8px;
      white-space: nowrap;
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
      .pfp-upload {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
      }
      .pfp-preview {
        width: 48px;
        height: 48px;
        border: 1px solid #7f9db9;
        background: #fcfcfe;
        overflow: hidden;
        flex-shrink: 0;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .pfp-hint {
        font-size: 10px;
        color: #555;
      }
    }
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
