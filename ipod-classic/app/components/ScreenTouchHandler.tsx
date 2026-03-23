"use client";
import { useCallback, useRef } from "react";
import styled from "styled-components";
import {
  dispatchForwardScrollEvent,
  dispatchBackwardScrollEvent,
} from "@/utils/events";

const SCROLL_THRESHOLD = 28;

const Wrapper = styled.div`
  height: 100%;
  touch-action: none;
`;

interface Props {
  children: React.ReactNode;
}

const ScreenTouchHandler = ({ children }: Props) => {
  const startY = useRef(0);
  const accumulated = useRef(0);
  const tracking = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    startY.current = e.clientY;
    accumulated.current = 0;
    tracking.current = true;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!tracking.current) return;
    if (e.buttons === 0 && e.pointerType === "mouse") return;

    const deltaY = e.clientY - startY.current;
    startY.current = e.clientY;
    accumulated.current += deltaY;

    while (Math.abs(accumulated.current) >= SCROLL_THRESHOLD) {
      if (accumulated.current > 0) {
        dispatchForwardScrollEvent();
        accumulated.current -= SCROLL_THRESHOLD;
      } else {
        dispatchBackwardScrollEvent();
        accumulated.current += SCROLL_THRESHOLD;
      }
    }
  }, []);

  const onPointerUp = useCallback(() => {
    tracking.current = false;
  }, []);

  const onPointerCancel = useCallback(() => {
    tracking.current = false;
  }, []);

  return (
    <Wrapper
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {children}
    </Wrapper>
  );
};

export default ScreenTouchHandler;
