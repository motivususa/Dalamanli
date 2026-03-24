import { ScrollDirection } from "@/components/ClickWheel/sharedTypes";

/** The click-wheel control associated with the particular event */
type BaseEventContext =
  | "wheel"
  | "center"
  | "forward"
  | "backward"
  | "menu"
  | "playpause";

export type SupportedKeyCode =
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "Escape"
  | "Enter"
  | " "
  | "Spacebar";

/** The action that is taken on a click-wheel control */
type BaseEventAction = "click" | "longclick" | "scroll" | "longpress";

/** The custom events that are supported for the iPod */
export type IpodEvent = `${BaseEventContext}${BaseEventAction}` | `idle`;

/** Create a type-safe custom event for the iPod */
export const createIpodEvent = (eventName: IpodEvent) => new Event(eventName);

/** Suppresses a second `menuclick` in the same synchronous turn (wheel can call dispatch twice). */
let menuClickBurstLock = false;

/** Always dispatch a new Event instance so each dispatch runs listeners (reusing one Event is unreliable). */
export const dispatchMenuClickEvent = () => {
  if (menuClickBurstLock) {
    return false;
  }
  menuClickBurstLock = true;
  queueMicrotask(() => {
    menuClickBurstLock = false;
  });

  return window.dispatchEvent(createIpodEvent("menuclick"));
};

export const dispatchCenterClickEvent = () =>
  window.dispatchEvent(createIpodEvent("centerclick"));

export const dispatchCenterLongClickEvent = () =>
  window.dispatchEvent(createIpodEvent("centerlongclick"));

export const dispatchForwardScrollEvent = () =>
  window.dispatchEvent(createIpodEvent("forwardscroll"));

export const dispatchBackwardScrollEvent = () =>
  window.dispatchEvent(createIpodEvent("backwardscroll"));

export const dispatchScrollEvent = (direction: ScrollDirection) =>
  direction === "clockwise"
    ? dispatchForwardScrollEvent()
    : dispatchBackwardScrollEvent();

export const dispatchWheelClickEvent = () =>
  window.dispatchEvent(createIpodEvent("wheelclick"));

export const dispatchMenuLongPressEvent = () =>
  window.dispatchEvent(createIpodEvent("menulongpress"));

export const dispatchBackClickEvent = () =>
  window.dispatchEvent(createIpodEvent("backwardclick"));

export const dispatchForwardClickEvent = () =>
  window.dispatchEvent(createIpodEvent("forwardclick"));

export const dispatchPlayPauseClickEvent = () =>
  window.dispatchEvent(createIpodEvent("playpauseclick"));

export const dispatchIdleEvent = () =>
  window.dispatchEvent(createIpodEvent("idle"));

export const dispatchKeyboardEvent = (key: string) => {
  switch (key) {
    case "ArrowUp":
    case "ArrowLeft":
      dispatchBackwardScrollEvent();
      break;
    case "ArrowDown":
    case "ArrowRight":
      dispatchForwardScrollEvent();
      break;
    case "Enter":
      dispatchCenterClickEvent();
      break;
    case " ":
    case "Spacebar":
      dispatchPlayPauseClickEvent();
      break;
    case "Escape":
      dispatchMenuClickEvent();
      break;
  }
};
