import { useCallback } from "react";

import { useEventListener, useViewContext, useHapticFeedback } from "@/hooks";

import { IpodEvent } from "@/utils/events";

/**
 * A quick way to use the menu button as a back button.
 * Provide an ID that matches the ID of the window you want to close.
 *
 * When "Now Playing" is pushed on top of another screen, the top of the stack is
 * `nowPlaying`, so handlers for views underneath never saw `top.id === id` and
 * could not pop — leaving `nowPlaying` stuck and breaking `isActive` for lists.
 *
 * If the top is `nowPlaying` and this hook is for a different view, only the
 * handler whose id matches the screen *directly under* Now Playing calls
 * `hideView()` once. That pops Now Playing exactly once (other mounted views
 * must not each call `hideView`, or one MENU would batch many pops).
 */
const useMenuHideView = (id: string) => {
  const { hideView, viewStack } = useViewContext();
  const { triggerHaptics } = useHapticFeedback();

  const handleClick = useCallback(() => {
    const stack = viewStack;
    if (stack.length < 2) return;

    const top = stack[stack.length - 1];
    const below = stack[stack.length - 2];

    if (top.id === "nowPlaying" && id !== "nowPlaying") {
      if (below?.id === id) {
        triggerHaptics();
        hideView();
      }
      return;
    }

    if (top.id === id) {
      triggerHaptics();
      hideView();
    }
  }, [hideView, id, viewStack, triggerHaptics]);

  useEventListener<IpodEvent>("menuclick", handleClick);
};

export default useMenuHideView;
