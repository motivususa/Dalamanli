"use client";
import { memo, useEffect, useCallback } from "react";
import {
  LocalAudioProvider,
  SettingsContext,
  SettingsProvider,
  useSettings,
} from "@/hooks";
import { ClickWheel, ViewManager } from "@/components";
import ScreenTouchHandler from "@/components/ScreenTouchHandler";
import {
  ScreenContainer,
  ClickWheelContainer,
  Shell,
  Sticker,
  Sticker2,
  Sticker3,
  MobileScaleWrapper,
} from "@/components/Ipod/Styled";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpotifySDKProvider } from "@/providers/SpotifySdkProvider";
import { MusicKitProvider } from "@/providers/MusicKitProvider";
import ViewContextProvider from "@/providers/ViewContextProvider";
import { GlobalStyles } from "@/components/Ipod/GlobalStyles";
import { SoundEffectsProvider } from "@/hooks/useSoundEffects";
import { WheelHelpTooltip } from "@/components/WheelHelpTooltip";

type Props = {
  appleAccessToken: string;
  spotifyCallbackCode?: string;
};

const queryClient = new QueryClient();

/** Dark page surround (#121212): system dark mode, night (7pm–7am), or black iPod body. */
function DarkSurroundSync() {
  const { deviceTheme } = useSettings();

  const apply = useCallback(() => {
    if (typeof window === "undefined") return;
    const hour = new Date().getHours();
    const night = hour >= 19 || hour < 7;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const on = prefersDark || night || deviceTheme === "black";
    document.documentElement.classList.toggle("ipod-dark-surround", on);
    document.body.classList.toggle("ipod-dark-surround", on);
  }, [deviceTheme]);

  useEffect(() => {
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    const id = setInterval(apply, 60_000);
    return () => {
      mq.removeEventListener("change", apply);
      clearInterval(id);
      document.documentElement.classList.remove("ipod-dark-surround");
      document.body.classList.remove("ipod-dark-surround");
    };
  }, [apply]);

  return null;
}

const Ipod = ({ appleAccessToken }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <SettingsProvider>
        <DarkSurroundSync />
        <ViewContextProvider>
          <SpotifySDKProvider>
            <MusicKitProvider token={appleAccessToken}>
              <LocalAudioProvider>
                <SoundEffectsProvider>
                  <SettingsContext.Consumer>
                    {([{ deviceTheme }]) => (
                      <MobileScaleWrapper>
                      <Shell $deviceTheme={deviceTheme}>
                        <Sticker $deviceTheme={deviceTheme} />
                        <Sticker2 $deviceTheme={deviceTheme} />
                        <Sticker3 $deviceTheme={deviceTheme} />
                        <ScreenContainer>
                          <ScreenTouchHandler>
                            <ViewManager />
                          </ScreenTouchHandler>
                        </ScreenContainer>
                        <WheelHelpTooltip />
                        <ClickWheelContainer>
                          <ClickWheel />
                        </ClickWheelContainer>
                      </Shell>
                      </MobileScaleWrapper>
                    )}
                  </SettingsContext.Consumer>
                </SoundEffectsProvider>
              </LocalAudioProvider>
            </MusicKitProvider>
          </SpotifySDKProvider>
        </ViewContextProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default memo(Ipod);
