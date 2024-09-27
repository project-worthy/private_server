import { useEffect, useRef, RefObject, useCallback, useState } from "react";

export type MouseState = {
  isDrag: boolean;
  isClick: boolean;
};

interface MouseDetectClicknDragProps {
  onClick?: (event: MouseEvent) => void;
  onDrag?: (event: MouseEvent) => void;
  onDragFinsih?: (event: MouseEvent) => void;
  onHovering?: (event: MouseEvent) => void;
  onHoverStart?: (event: MouseEvent) => void;
  onHoverEnd?: (event: MouseEvent) => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
}

// function assertIsNode(e: EventTarget | null): asserts e is Node {
//   if (!e || !("nodeType" in e)) {
//     throw new Error(`Node expected`);
//   }
// }

const delta = 3;

export default function useMouseDetectClicknDrag<T extends HTMLElement>(
  ref: RefObject<T>,
  props: MouseDetectClicknDragProps,
) {
  const {
    onClick,
    onDrag,
    onDragFinsih,
    onHovering,
    onHoverEnd,
    onHoverStart,
    onMouseUp,
    onMouseDown,
  } = props;

  // const isDrag = useRef(-1);
  enum MOUSESTATE {
    IDLE = -1,
    CLICK,
    DRAG,
  }
  const mouseState = useRef(MOUSESTATE.IDLE);
  const startMousesPos = useRef<{ x: number; y: number }>();

  const handleMouseDown = (e: MouseEvent) => {
    onMouseDown?.(e);
    startMousesPos.current = { x: e.pageX, y: e.pageY };
    mouseState.current = 0;
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (mouseState.current < 0) {
        onHovering?.(e);
      }
      if (startMousesPos.current === undefined) {
        return;
      }
      if (mouseState.current > 0) {
        onDrag?.(e);
      }

      const diffX = Math.abs(e.pageX - startMousesPos.current.x);
      const diffY = Math.abs(e.pageY - startMousesPos.current.y);
      if ((mouseState.current === 0 && diffX >= delta) || diffY >= delta) {
        mouseState.current = 1;
        return;
      }
    },
    [onHovering, onDrag],
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      onMouseUp?.(e);
      if (!startMousesPos.current) return;
      const diffX = Math.abs(e.pageX - startMousesPos.current.x);
      const diffY = Math.abs(e.pageY - startMousesPos.current.y);
      if (mouseState.current === 0 && diffX < delta && diffY < delta) {
        onClick?.(e);
      } else if (mouseState.current > 1) {
        onDragFinsih?.(e);
      }
      mouseState.current = -1;
      startMousesPos.current = undefined;
    },
    [onMouseUp, onClick, onDragFinsih],
  );

  const handleMouseEnter = (e: MouseEvent) => {
    onHoverStart?.(e);
  };

  const handleMouseLeave = (e: MouseEvent) => {
    if (mouseState.current === 1) handleMouseUp(e);
    startMousesPos.current = undefined;
    onHoverEnd?.(e);
  };
  const actions = {
    mouseDown: handleMouseDown,
    mouseUp: handleMouseUp,
    mouseEnter: handleMouseEnter,
    mouseLeave: handleMouseLeave,
  };

  useEffect(() => {
    ref.current?.addEventListener("mouseenter", handleMouseEnter);
    ref.current?.addEventListener("mouseleave", handleMouseLeave);
    ref.current?.addEventListener("mousedown", handleMouseDown);
    ref.current?.addEventListener("mousemove", handleMouseMove);
    ref.current?.addEventListener("mouseup", handleMouseUp);
    return () => {
      ref.current?.removeEventListener("mouseenter", handleMouseEnter);
      ref.current?.removeEventListener("mouseleave", handleMouseLeave);
      ref.current?.removeEventListener("mousedown", handleMouseDown);
      ref.current?.removeEventListener("mousemove", handleMouseMove);
      ref.current?.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // return {actions};
}
