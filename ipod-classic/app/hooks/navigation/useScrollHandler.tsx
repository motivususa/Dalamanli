import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { SelectableListOption } from "@/components";
import { ViewId } from "@/components/views/registry";
import { PopupId, ActionSheetId } from "@/providers/ViewContextProvider";
import useHapticFeedback from "@/hooks/useHapticFeedback";
import { IpodEvent } from "@/utils/events";
import * as Utils from "@/utils";

import { useAudioPlayer, useEventListener, useViewContext } from "@/hooks";

/** Gets the initial index for the scroll position. If there is a selected option,
 * this will initialize our initial scroll position at the selectedOption  */
const getInitIndex = (
  options: SelectableListOption[] = [],
  selectedOption?: SelectableListOption
): number => {
  if (selectedOption) {
    const selectedOptionIndex = options.findIndex(
      (option) => option === selectedOption
    );

    if (selectedOptionIndex > -1) {
      return selectedOptionIndex;
    }
  }

  // Always default to 0 if there isn't a selectedOption
  // or if the selectedOption wasn't found in the list of options.
  return 0;
};

/** Accepts a list of options and will maintain a scroll index capped at the list's length. */
const useScrollHandler = (
  /** This should match the view's ID (screen view, popup, action sheet, or keyboard). */
  id: ViewId | PopupId | ActionSheetId | "keyboard",
  /** A list of all scrollable items. Used to cap the scrolling to the last element. */
  options: SelectableListOption[] = [],
  selectedOption?: SelectableListOption,
  /**
   * This function is called when the user has scrolled close to the end of the list of options.
   * Useful for fetching the next page of data before the user reaches the end of the list.
   */
  onNearEndOfList?: (currentLength: number) => void
) => {
  const { triggerHaptics } = useHapticFeedback();
  const { showView, showPopup, showActionSheet, viewStack, setPreview } =
    useViewContext();
  const { play, nowPlayingItem } = useAudioPlayer();
  const [index, setIndex] = useState(getInitIndex(options, selectedOption));
  /** Only fire events on the top-most view. */
  const isActive = viewStack[viewStack.length - 1].id === id;

  /**
   * Allow scrolling even when nowPlaying is on top of this view.
   * This lets users browse the song list while music is playing.
   * We check if this view is in the stack AND the only thing above it is nowPlaying.
   */
  const isActiveOrBehindNowPlaying = isActive || (
    viewStack.some(v => v.id === id) &&
    viewStack[viewStack.length - 1].id === "nowPlaying"
  );

  /** Wait until the user stops scrolling to check for a new preview to display. */
  const updatePreview = useCallback(
    (i: number) => {
      if (!isActive || !options[i]) return;
      const preview = options[i].preview;
      if (preview) {
        setPreview(preview);
      }
    },
    [isActive, options, setPreview]
  );

  const debouncedUpdatePreview = useDebouncedCallback(updatePreview, 750);

  const handleForwardScroll = useCallback(() => {
    if (isActiveOrBehindNowPlaying) {
      triggerHaptics(true);
    }

    setIndex((prevIndex) => {
      if (prevIndex < options.length - 1 && isActiveOrBehindNowPlaying) {
        debouncedUpdatePreview(prevIndex + 1);

        // Trigger near-end-of-list callback when we're halfway through the current list.
        const nextIndex = prevIndex + 1;
        if (nextIndex === Math.round(options.length / 2)) {
          onNearEndOfList?.(options.length);
        }

        return nextIndex;
      }

      return prevIndex;
    });
  }, [
    debouncedUpdatePreview,
    isActiveOrBehindNowPlaying,
    onNearEndOfList,
    options.length,
    triggerHaptics,
  ]);

  const handleBackwardScroll = useCallback(() => {
    if (isActiveOrBehindNowPlaying) {
      triggerHaptics(true);
    }

    setIndex((prevIndex) => {
      if (prevIndex > 0 && isActiveOrBehindNowPlaying) {
        debouncedUpdatePreview(prevIndex - 1);
        return prevIndex - 1;
      }

      return prevIndex;
    });
  }, [debouncedUpdatePreview, isActiveOrBehindNowPlaying, triggerHaptics]);

  /** Parses the selected option for a new view to show or song to play. */
  const handleCenterClick = useCallback(async () => {
    const option = options[index];
    if (!isActive || !option) return;
    triggerHaptics();

    switch (option.type) {
      case "song":
        // Check if the selected song is already the currently playing song
        const songId = Utils.getSongIdFromQueueOptions(
          option.queueOptions,
          option.queueOptions.startPosition
        );

        const isSameSong = nowPlayingItem && songId === nowPlayingItem.id;

        // If it's the same song, just navigate to Now Playing view
        // (unless we're in CoverFlow, which handles its own now playing view)
        // Otherwise, play the song
        if (isSameSong && id !== "coverFlow") {
          showView("nowPlaying");
        } else if (!isSameSong) {
          await play(option.queueOptions);

          if (option.showNowPlayingView) {
            showView("nowPlaying");
          }
        }
        break;
      case "link":
        window.open(option.url, "_blank");
        break;
      case "view":
        showView(option.viewId, option.props, option.headerTitle);
        break;
      case "action":
        option.onSelect();
        break;
      case "popup":
        showPopup({
          id: option.popupId,
          title: option.title,
          description: option.description,
          listOptions: option.listOptions,
        });
        break;
      case "actionSheet":
        showActionSheet({
          id: option.id,
          listOptions: option.listOptions,
        });
        break;
    }
  }, [
    options,
    index,
    isActive,
    triggerHaptics,
    nowPlayingItem,
    id,
    showView,
    showPopup,
    showActionSheet,
    play,
  ]);

  const handleCenterLongClick = useCallback(async () => {
    const option = options[index];

    if (!isActive || !option) return;

    if (option.longPressOptions) {
      showActionSheet({
        id: "media-action-sheet",
        listOptions: option.longPressOptions,
      });
    }
  }, [index, isActive, options, showActionSheet]);

  /** If the list length changes and the index is larger, reset the index to 0. */
  useEffect(() => {
    if (options.length && index > options.length - 1) {
      setIndex(0);
    }
  }, [index, options.length]);

  /** Set the initial preview when options load or index changes */
  useEffect(() => {
    debouncedUpdatePreview(index);
  }, [index, debouncedUpdatePreview]);

  /** Tap on a specific item: select it and trigger its action. */
  const handleItemTap = useCallback(
    async (targetIndex: number) => {
      if (!isActive) return;
      const option = options[targetIndex];
      if (!option) return;

      if (targetIndex !== index) {
        setIndex(targetIndex);
        updatePreview(targetIndex);
        triggerHaptics();
        return;
      }

      triggerHaptics();

      switch (option.type) {
        case "song": {
          const songId = Utils.getSongIdFromQueueOptions(
            option.queueOptions,
            option.queueOptions.startPosition
          );
          const isSameSong = nowPlayingItem && songId === nowPlayingItem.id;
          if (isSameSong && id !== "coverFlow") {
            showView("nowPlaying");
          } else if (!isSameSong) {
            await play(option.queueOptions);
            if (option.showNowPlayingView) showView("nowPlaying");
          }
          break;
        }
        case "link":
          window.open(option.url, "_blank");
          break;
        case "view":
          showView(option.viewId, option.props, option.headerTitle);
          break;
        case "action":
          option.onSelect();
          break;
        case "popup":
          showPopup({
            id: option.popupId,
            title: option.title,
            description: option.description,
            listOptions: option.listOptions,
          });
          break;
        case "actionSheet":
          showActionSheet({
            id: option.id,
            listOptions: option.listOptions,
          });
          break;
      }
    },
    [
      isActive,
      options,
      index,
      updatePreview,
      triggerHaptics,
      nowPlayingItem,
      id,
      showView,
      showPopup,
      showActionSheet,
      play,
    ]
  );

  useEventListener<IpodEvent>("centerclick", handleCenterClick);
  useEventListener<IpodEvent>("centerlongclick", handleCenterLongClick);
  useEventListener<IpodEvent>("forwardscroll", handleForwardScroll);
  useEventListener<IpodEvent>("backwardscroll", handleBackwardScroll);

  return [index, handleItemTap] as const;
};

export default useScrollHandler;
