"use client";
import { memo, useEffect } from "react";
import {
  LocalAudioProvider,
  SettingsContext,
  SettingsProvider,
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

function useTimeBasedTheme() {
  useEffect(() => {
    const apply = () => {
      const hour = new Date().getHours();
      const isNight = hour >= 19 || hour < 7;
      document.body.classList.toggle("ipod-night-mode", isNight);
    };
    apply();
    const id = setInterval(apply, 60_000);
    return () => clearInterval(id);
  }, []);
}

const Ipod = ({ appleAccessToken }: Props) => {
  useTimeBasedTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <SettingsProvider>
        <ViewContextProvider>
          <SpotifySDKProvider>
            <MusicKitProvider token={appleAccessToken}>
              <LocalAudioProvider>
                <SoundEffectsProvider>
                  <SettingsContext.Consumer>
                    {([{ deviceTheme }]) => (
                      <Shell $deviceTheme={deviceTheme}>
                        <Sticker $deviceTheme={deviceTheme} />
                        <Sticker2 $deviceTheme={deviceTheme} />
                        <Sticker3 $deviceTheme={deviceTheme} />
                        <ScreenContainer>
                          <ScreenTouchHandler>
                            <ViewManager />
                          </ScreenTouchHandler>
                        </ScreenContainer>
                        <ClickWheelContainer>
                          <ClickWheel />
                          <WheelHelpTooltip />
                        </ClickWheelContainer>
                      </Shell>
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
