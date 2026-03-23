import React, { useReducer, useRef, useCallback, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import useMouse from 'react-use/lib/useMouse';

import {
  ADD_APP,
  DEL_APP,
  FOCUS_APP,
  FOCUS_AND_SHAKE_APP,
  MINIMIZE_APP,
  TOGGLE_MAXIMIZE_APP,
  FOCUS_ICON,
  SELECT_ICONS,
  FOCUS_DESKTOP,
  START_SELECT,
  END_SELECT,
  POWER_OFF,
  CANCEL_POWER_OFF,
  SHUTDOWN_START,
  SHUTDOWN_VIDEO_END,
  WAKE_UP,
} from './constants/actions';
import { FOCUSING, POWER_STATE } from './constants';
import { defaultIconState, defaultAppState, appSettings } from './apps';
import LogOnComponent from './apps/LogOn';
import {
  isWinXpSignedIn,
  clearWinXpSignedIn,
} from './constants/session';
import Modal from './Modal';
import ShutdownOverlay from './ShutdownOverlay';
import Footer from './Footer';
import Windows from './Windows';
import Icons from './Icons';
import { DashedBox } from '../components';
import AquariumScreensaver from './AquariumScreensaver';

const IDLE_SCREENSAVER_MS = 4 * 60 * 1000;

const initState = {
  apps: defaultAppState,
  nextAppID: defaultAppState.length,
  nextZIndex: defaultAppState.length,
  focusing: FOCUSING.WINDOW,
  icons: defaultIconState,
  selecting: false,
  powerState: POWER_STATE.START,
  computerOff: false, // false | 'video' | 'black'
};
const reducer = (state, action = { type: '' }) => {
  switch (action.type) {
    case ADD_APP:
      const app = state.apps.find(
        _app => _app.component === action.payload.component,
      );
      if (action.payload.multiInstance || !app) {
        return {
          ...state,
          apps: [
            ...state.apps,
            {
              ...action.payload,
              id: state.nextAppID,
              zIndex: state.nextZIndex,
            },
          ],
          nextAppID: state.nextAppID + 1,
          nextZIndex: state.nextZIndex + 1,
          focusing: FOCUSING.WINDOW,
        };
      }
      const apps = state.apps.map(app =>
        app.component === action.payload.component
          ? { ...app, zIndex: state.nextZIndex, minimized: false }
          : app,
      );
      return {
        ...state,
        apps,
        nextZIndex: state.nextZIndex + 1,
        focusing: FOCUSING.WINDOW,
      };
    case DEL_APP:
      if (state.focusing !== FOCUSING.WINDOW) return state;
      return {
        ...state,
        apps: state.apps.filter(app => app.id !== action.payload),
        focusing:
          state.apps.length > 1
            ? FOCUSING.WINDOW
            : state.icons.find(icon => icon.isFocus)
            ? FOCUSING.ICON
            : FOCUSING.DESKTOP,
      };
    case FOCUS_APP: {
      const apps = state.apps.map(app =>
        app.id === action.payload
          ? { ...app, zIndex: state.nextZIndex, minimized: false }
          : app,
      );
      return {
        ...state,
        apps,
        nextZIndex: state.nextZIndex + 1,
        focusing: FOCUSING.WINDOW,
      };
    }
    case FOCUS_AND_SHAKE_APP: {
      const id = action.payload;
      const apps = state.apps.map(app =>
        app.id === id
          ? {
              ...app,
              zIndex: state.nextZIndex,
              minimized: false,
              shakeNonce: (app.shakeNonce || 0) + 1,
            }
          : app,
      );
      return {
        ...state,
        apps,
        nextZIndex: state.nextZIndex + 1,
        focusing: FOCUSING.WINDOW,
      };
    }
    case MINIMIZE_APP: {
      if (state.focusing !== FOCUSING.WINDOW) return state;
      const apps = state.apps.map(app =>
        app.id === action.payload ? { ...app, minimized: true } : app,
      );
      return {
        ...state,
        apps,
        focusing: FOCUSING.WINDOW,
      };
    }
    case TOGGLE_MAXIMIZE_APP: {
      if (state.focusing !== FOCUSING.WINDOW) return state;
      const apps = state.apps.map(app =>
        app.id === action.payload ? { ...app, maximized: !app.maximized } : app,
      );
      return {
        ...state,
        apps,
        focusing: FOCUSING.WINDOW,
      };
    }
    case FOCUS_ICON: {
      const icons = state.icons.map(icon => ({
        ...icon,
        isFocus: icon.id === action.payload,
      }));
      return {
        ...state,
        focusing: FOCUSING.ICON,
        icons,
      };
    }
    case SELECT_ICONS: {
      const icons = state.icons.map(icon => ({
        ...icon,
        isFocus: action.payload.includes(icon.id),
      }));
      return {
        ...state,
        icons,
        focusing: FOCUSING.ICON,
      };
    }
    case FOCUS_DESKTOP:
      return {
        ...state,
        focusing: FOCUSING.DESKTOP,
        icons: state.icons.map(icon => ({
          ...icon,
          isFocus: false,
        })),
      };
    case START_SELECT:
      return {
        ...state,
        focusing: FOCUSING.DESKTOP,
        icons: state.icons.map(icon => ({
          ...icon,
          isFocus: false,
        })),
        selecting: action.payload,
      };
    case END_SELECT:
      return {
        ...state,
        selecting: null,
      };
    case POWER_OFF:
      return {
        ...state,
        powerState: action.payload,
      };
    case CANCEL_POWER_OFF:
      return {
        ...state,
        powerState: POWER_STATE.START,
      };
    case SHUTDOWN_START:
      return {
        ...state,
        powerState: POWER_STATE.START,
        computerOff: 'video',
      };
    case SHUTDOWN_VIDEO_END:
      return {
        ...state,
        computerOff: 'black',
      };
    case WAKE_UP:
      return {
        ...state,
        computerOff: false,
      };
    default:
      return state;
  }
};
function WinXP() {
  const [state, dispatch] = useReducer(reducer, initState);
  const [winXpSignedIn, setWinXpSignedIn] = useState(() => isWinXpSignedIn());
  const [screensaverOn, setScreensaverOn] = useState(false);
  const idleTimerRef = useRef(null);
  const screensaverOnRef = useRef(false);
  const screensaverIdleAllowedRef = useRef(false);
  const ref = useRef(null);
  const mouse = useMouse(ref);
  const focusedAppId = getFocusedAppId();

  useEffect(() => {
    screensaverOnRef.current = screensaverOn;
  }, [screensaverOn]);

  useEffect(() => {
    const onSession = () => setWinXpSignedIn(isWinXpSignedIn());
    window.addEventListener('winxp-session-changed', onSession);
    return () => window.removeEventListener('winxp-session-changed', onSession);
  }, []);

  const screensaverIdleEnabled =
    !state.computerOff && state.powerState === POWER_STATE.START;

  useEffect(() => {
    screensaverIdleAllowedRef.current = screensaverIdleEnabled;
  }, [screensaverIdleEnabled]);

  const bumpScreensaverActivity = useCallback(() => {
    if (screensaverOnRef.current) {
      setScreensaverOn(false);
    }
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (screensaverIdleAllowedRef.current) {
        setScreensaverOn(true);
      }
    }, IDLE_SCREENSAVER_MS);
  }, []);

  useEffect(() => {
    if (!screensaverIdleEnabled) {
      setScreensaverOn(false);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      return;
    }

    bumpScreensaverActivity();
    const opts = { capture: true, passive: true };
    const names = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'];
    names.forEach(n => window.addEventListener(n, bumpScreensaverActivity, opts));
    return () => {
      names.forEach(n =>
        window.removeEventListener(n, bumpScreensaverActivity, opts),
      );
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };
  }, [screensaverIdleEnabled, bumpScreensaverActivity]);

  const focusOrOpenLogOn = useCallback(() => {
    const logon = state.apps.find(a => a.component === LogOnComponent);
    if (logon) {
      dispatch({ type: FOCUS_AND_SHAKE_APP, payload: logon.id });
    } else {
      dispatch({ type: ADD_APP, payload: appSettings.LogOn });
    }
  }, [state.apps]);
  const onFocusApp = useCallback(id => {
    dispatch({ type: FOCUS_APP, payload: id });
  }, []);
  const onMaximizeWindow = useCallback(
    id => {
      if (focusedAppId === id) {
        dispatch({ type: TOGGLE_MAXIMIZE_APP, payload: id });
      }
    },
    [focusedAppId],
  );
  const onMinimizeWindow = useCallback(
    id => {
      if (focusedAppId === id) {
        dispatch({ type: MINIMIZE_APP, payload: id });
      }
    },
    [focusedAppId],
  );
  const onCloseApp = useCallback(
    id => {
      if (focusedAppId === id) {
        dispatch({ type: DEL_APP, payload: id });
      }
    },
    [focusedAppId],
  );
  function onMouseDownFooterApp(id) {
    if (focusedAppId === id) {
      dispatch({ type: MINIMIZE_APP, payload: id });
    } else {
      dispatch({ type: FOCUS_APP, payload: id });
    }
  }
  function onMouseDownIcon(id) {
    dispatch({ type: FOCUS_ICON, payload: id });
  }
  function onDoubleClickIcon(component) {
    const appSetting = Object.values(appSettings).find(
      setting => setting.component === component,
    );
    dispatch({ type: ADD_APP, payload: appSetting });
  }
  function getFocusedAppId() {
    if (state.focusing !== FOCUSING.WINDOW) return -1;
    const focusedApp = [...state.apps]
      .sort((a, b) => b.zIndex - a.zIndex)
      .find(app => !app.minimized);
    return focusedApp ? focusedApp.id : -1;
  }
  function onMouseDownFooter() {
    dispatch({ type: FOCUS_DESKTOP });
  }
  function onClickMenuItem(o) {
    if (o === 'Internet')
      dispatch({ type: ADD_APP, payload: appSettings['Internet Explorer'] });
    else if (o === 'Minesweeper')
      dispatch({ type: ADD_APP, payload: appSettings.Minesweeper });
    else if (o === 'My Computer')
      dispatch({ type: ADD_APP, payload: appSettings['My Computer'] });
    else if (o === 'Notepad')
      dispatch({ type: ADD_APP, payload: appSettings.Notepad });
    else if (o === 'Winamp')
      dispatch({ type: ADD_APP, payload: appSettings.Winamp });
    else if (o === 'Paint')
      dispatch({ type: ADD_APP, payload: appSettings.Paint });
    else if (o === 'AIM')
      dispatch({ type: ADD_APP, payload: appSettings.AIM });
    else if (o === 'WebCam Viewer')
      dispatch({ type: ADD_APP, payload: appSettings['WebCam Viewer'] });
    else if (o === 'Welcome to my Windows')
      dispatch({ type: ADD_APP, payload: appSettings.WelcomeToMyWindows });
    else if (o === 'iPod') {
      sessionStorage.removeItem('winxp-disclaimer-accepted');
      sessionStorage.removeItem('winxp-boot-complete');
      document.documentElement.classList.remove('winxp-landing-dismissed');
      const gate = document.getElementById('landing-gate');
      if (gate) {
        gate.hidden = false;
        gate.removeAttribute('aria-hidden');
      }
    }
    else if (o === 'Log Off' || o === 'Sign In')
      dispatch({ type: POWER_OFF, payload: POWER_STATE.LOG_OFF });
    else if (o === 'Turn Off Computer')
      dispatch({ type: POWER_OFF, payload: POWER_STATE.TURN_OFF });
    else
      dispatch({
        type: ADD_APP,
        payload: {
          ...appSettings.Error,
          injectProps: { message: 'C:\\\nApplication not found' },
        },
      });
  }
  function onMouseDownDesktop(e) {
    if (e.target === e.currentTarget)
      dispatch({
        type: START_SELECT,
        payload: { x: mouse.docX, y: mouse.docY },
      });
  }
  function onMouseUpDesktop(e) {
    dispatch({ type: END_SELECT });
  }
  const onIconsSelected = useCallback(
    iconIds => {
      dispatch({ type: SELECT_ICONS, payload: iconIds });
    },
    [dispatch],
  );
  const openErrorDialog = useCallback((message, title = 'Notice') => {
    dispatch({
      type: ADD_APP,
      payload: {
        ...appSettings.Error,
        header: {
          ...appSettings.Error.header,
          title: title || 'Notice',
        },
        injectProps: { message },
      },
    });
  }, []);
  function pauseAllSiteAudio() {
    document.querySelectorAll('audio, video').forEach(el => el.pause());
    window.dispatchEvent(new CustomEvent('winxp-shutdown'));
  }
  async function onClickModalButton(text) {
    if (text === 'Turn Off') {
      pauseAllSiteAudio();
      dispatch({ type: SHUTDOWN_START });
      return;
    }
    if (text === 'Switch User' || text === 'Sign In') {
      focusOrOpenLogOn();
      dispatch({ type: CANCEL_POWER_OFF });
      return;
    }
    if (text === 'Log Off') {
      try {
        const { signOut } = await import('firebase/auth');
        const { auth } = await import('./apps/AIM/firebase');
        await signOut(auth);
      } catch (e) {
        console.warn('Log off:', e);
      }
      clearWinXpSignedIn();
      window.dispatchEvent(new CustomEvent('winxp-session-changed'));
      dispatch({ type: CANCEL_POWER_OFF });
      return;
    }
    dispatch({ type: CANCEL_POWER_OFF });
    dispatch({
      type: ADD_APP,
      payload: {
        ...appSettings.Error,
        injectProps: { message: 'C:\\\nApplication not found' },
      },
    });
  }
  function onModalClose() {
    dispatch({ type: CANCEL_POWER_OFF });
  }
  const showDesktop = !state.computerOff;

  return (
    <Container
      ref={ref}
      onMouseUp={onMouseUpDesktop}
      onMouseDown={onMouseDownDesktop}
      state={state.powerState}
    >
      {showDesktop && (
        <>
          <Icons
            icons={state.icons}
            onMouseDown={onMouseDownIcon}
            onDoubleClick={onDoubleClickIcon}
            displayFocus={state.focusing === FOCUSING.ICON}
            appSettings={appSettings}
            mouse={mouse}
            selecting={state.selecting}
            setSelectedIcons={onIconsSelected}
          />
          <DashedBox startPos={state.selecting} mouse={mouse} />
          <Windows
            apps={state.apps}
            onMouseDown={onFocusApp}
            onClose={onCloseApp}
            onMinimize={onMinimizeWindow}
            onMaximize={onMaximizeWindow}
            focusedAppId={focusedAppId}
            openErrorDialog={openErrorDialog}
            openApp={name => {
              if (appSettings[name]) {
                dispatch({ type: ADD_APP, payload: appSettings[name] });
              }
            }}
          />
          <Footer
            apps={state.apps}
            onMouseDownApp={onMouseDownFooterApp}
            focusedAppId={focusedAppId}
            onMouseDown={onMouseDownFooter}
            onClickMenuItem={onClickMenuItem}
            winXpSignedIn={winXpSignedIn}
          />
        </>
      )}
      {state.powerState !== POWER_STATE.START && !state.computerOff && (
        <Modal
          onClose={onModalClose}
          onClickButton={onClickModalButton}
          mode={state.powerState}
          winXpSignedIn={winXpSignedIn}
        />
      )}
      {state.computerOff && (
        <ShutdownOverlay
          phase={state.computerOff}
          onVideoEnd={() => dispatch({ type: SHUTDOWN_VIDEO_END })}
          onWake={() => dispatch({ type: WAKE_UP })}
        />
      )}
      <AquariumScreensaver
        visible={screensaverOn}
        onWake={bumpScreensaverActivity}
      />
    </Container>
  );
}

const powerOffAnimation = keyframes`
  0% {
    filter: brightness(1) grayscale(0);
  }
  30% {
    filter: brightness(1) grayscale(0);
  }
  100% {
    filter: brightness(0.6) grayscale(1);
  }
`;
const animation = {
  [POWER_STATE.START]: '',
  [POWER_STATE.TURN_OFF]: powerOffAnimation,
  [POWER_STATE.LOG_OFF]: powerOffAnimation,
};

const Container = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans');
  font-family: Tahoma, 'Noto Sans', sans-serif;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: url(https://i.imgur.com/Zk6TR5k.jpg) no-repeat center center fixed;
  background-size: cover;
  animation: ${({ state }) => animation[state]} 5s forwards;
  *:not(input):not(textarea) {
    user-select: none;
  }
`;

export default WinXP;
