import styled from "styled-components";
import { Screen, Unit } from "@/utils/constants";
import { DeviceThemeName, getTheme } from "@/utils/themes";

export const Shell = styled.div<{ $deviceTheme: DeviceThemeName }>`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 370px;
  max-height: 37em;
  margin: auto;
  border-radius: 30px;
  box-shadow: inset 0 0 2.4em #555;
  background: ${({ $deviceTheme }) => getTheme($deviceTheme).body.background};
  -webkit-box-reflect: below 0px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(50%, transparent), to(rgba(250, 250, 250, 0.3)));
  animation: descend 1.5s ease;
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    box-shadow: inset 0 0 2.4em black;
  }

  ${Screen.SM.MediaQuery} {
    animation: none;
    -webkit-box-reflect: unset;
    width: 370px;
    max-height: 37em;
    border-radius: 30px;
    margin: 0 auto;
    /* No transform here — scaling is handled by MobileScaleWrapper parent */
  }

  @keyframes descend {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export const ScreenContainer = styled.div`
  position: relative;
  height: 260px;
  margin: ${Unit.LG} ${Unit.LG} 0;
  border: 4px solid black;
  border-radius: ${Unit.XS};
  overflow: hidden;
  background: white;
  animation: fadeFromBlack 0.5s;

  @keyframes fadeFromBlack {
    0% {
      filter: brightness(0);
    }
  }

  ${Screen.SM.MediaQuery} {
    margin: ${Unit.MD} ${Unit.MD} 0;
  }
`;

export const ClickWheelContainer = styled.div`
  margin: auto;
`;

export const Sticker = styled.div<{ $deviceTheme: DeviceThemeName }>`
  position: absolute;
  background: ${({ $deviceTheme }) =>
    getTheme($deviceTheme).body.sticker1?.background};
  ${({ $deviceTheme: deviceTheme }) =>
    getTheme(deviceTheme).body.sticker1?.styles ?? {}};
`;

export const Sticker2 = styled.div<{ $deviceTheme: DeviceThemeName }>`
  position: absolute;
  background: ${({ $deviceTheme }) =>
    getTheme($deviceTheme).body.sticker2?.background};
  ${({ $deviceTheme: deviceTheme }) =>
    getTheme(deviceTheme).body.sticker2?.styles ?? {}};
`;

export const Sticker3 = styled.div<{ $deviceTheme: DeviceThemeName }>`
  position: absolute;
  background: ${({ $deviceTheme }) =>
    getTheme($deviceTheme).body.sticker3?.background};
  ${({ $deviceTheme: deviceTheme }) =>
    getTheme(deviceTheme).body.sticker3?.styles ?? {}};
`;

/**
 * Outer wrapper that applies CSS scale on mobile only.
 * Keeping this OUTSIDE the Shell means all getBoundingClientRect()
 * calls inside Shell (CoverFlow midpoint, scroll positions) return
 * real unscaled values — the scale is purely visual at this layer.
 */
export const MobileScaleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  ${Screen.SM.MediaQuery} {
    --s: min(0.82, calc(100vw / 370px));
    transform: scale(var(--s));
    transform-origin: top center;
    /* Collapse dead space left by scale */
    height: calc(37em * var(--s));
    align-items: flex-start;
  }
`;
