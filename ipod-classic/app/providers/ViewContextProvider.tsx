import { createContext, useEffect, useState } from "react";

import { SelectableListOption } from "@/components/SelectableList";
import { SplitScreenPreview } from "@/components/previews";
import { ViewId, ViewProps, VIEW_REGISTRY } from "@/components/views/registry";

/**
 * Known popup IDs used throughout the app.
 */
export type PopupId =
  | "spotifyNotSupported"
  | "spotifyNonPremium"
  | "musicProviderError";

/**
 * Known action sheet IDs used throughout the app.
 */
export type ActionSheetId =
  | "media-action-sheet"
  | "signin-popup"
  | "device-theme-action-sheet"
  | "service-type-action-sheet"
  | "sign-out-popup"
  | "shuffle-mode-action-sheet"
  | "repeat-mode-action-sheet"
  | "haptics-action-sheet";

/**
 * Screen view instance - references a view in the registry
 */
export type ScreenViewInstance<TViewId extends ViewId = ViewId> = {
  type: "screen";
  id: TViewId;
  props?: ViewProps[TViewId];
  headerTitle?: string;
  onClose?: (..._args: any[]) => void;
  styles?: Record<string, any>;
};

/**
 * Action sheet instance - dynamic overlay with list options
 */
export type ActionSheetInstance = {
  type: "actionSheet";
  id: ActionSheetId;
  listOptions: SelectableListOption[];
  headerTitle?: string;
  onClose?: (..._args: any[]) => void;
};

/**
 * Popup instance - dynamic overlay with title, description, and options
 */
export type PopupInstance = {
  type: "popup";
  id: PopupId;
  title: string;
  description?: string;
  listOptions: SelectableListOption[];
  onClose?: (..._args: any[]) => void;
};

/**
 * Keyboard instance - text input overlay
 */
export type KeyboardInstance = {
  type: "keyboard";
  id: "keyboard";
  initialValue?: string;
  onClose?: (..._args: any[]) => void;
};

/**
 * CoverFlow instance - special album browsing view
 */
export type CoverFlowInstance = {
  type: "coverFlow";
  id: string;
  onClose?: (..._args: any[]) => void;
};

/**
 * Union of all possible view instances
 */
export type ViewInstance =
  | ScreenViewInstance
  | ActionSheetInstance
  | PopupInstance
  | KeyboardInstance
  | CoverFlowInstance;

interface ViewContextState {
  viewStack: ViewInstance[];
  headerTitle?: string;
  preview: SplitScreenPreview;
}

type ViewContextStateType = [
  ViewContextState,
  React.Dispatch<React.SetStateAction<ViewContextState>>,
];

export const ViewContext = createContext<ViewContextStateType>([
  {
    viewStack: [],
    headerTitle: "Kaya's iPod",
    preview: SplitScreenPreview.Music,
  },
  () => {},
]);

interface Props {
  children: React.ReactNode;
}

const ViewContextProvider = ({ children }: Props) => {
  const baseView: ScreenViewInstance<"home"> = {
    type: "screen",
    id: "home",
  };

  const viewStack: ViewInstance[] = [baseView];
  const [viewContextState, setViewContextState] = useState<ViewContextState>({
    viewStack,
    headerTitle: VIEW_REGISTRY.home.title,
    preview: SplitScreenPreview.Music,
  });

  /** One MENU press must pop exactly once. Per-view `useMenuHideView` listeners all ran on the same
   *  event and each called `hideView()`, scheduling two pops (e.g. Now Playing → Playlists). */
  useEffect(() => {
    const onMenuClick = () => {
      setViewContextState((prev) => {
        const stack = prev.viewStack;
        if (stack.length < 2) return prev;

        const top = stack[stack.length - 1];
        if (top.type === "coverFlow") {
          return prev;
        }

        const newViewStack = stack.slice(0, -1);
        const newTopView = newViewStack[newViewStack.length - 1];

        let headerTitle: string | undefined;
        if (newTopView.type === "screen") {
          const config = VIEW_REGISTRY[newTopView.id as ViewId];
          headerTitle = newTopView.headerTitle ?? config?.title;
        } else if ("headerTitle" in newTopView) {
          headerTitle = newTopView.headerTitle;
        }

        return {
          ...prev,
          viewStack: newViewStack,
          headerTitle,
        };
      });
    };

    window.addEventListener("menuclick", onMenuClick);
    return () => window.removeEventListener("menuclick", onMenuClick);
  }, []);

  return (
    <ViewContext.Provider value={[viewContextState, setViewContextState]}>
      {children}
    </ViewContext.Provider>
  );
};

export default ViewContextProvider;
