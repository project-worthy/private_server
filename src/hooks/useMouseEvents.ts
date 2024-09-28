import { useEffect, useRef, useCallback, useState, useMemo } from "react";

import { cursorTo } from "readline";

import type { RefObject, DependencyList } from "react";

export type MouseEventState = {
  isDrag: boolean;
  isHover: boolean;
  mouseUpPos: { x: number; y: number };
  mouseDownPos: { x: number; y: number };
};

interface MouseDetectClicknDragOpts {
  delta?: number;
  strict?: boolean;
  except?: Array<string | RefObject<Element>>;
  onClick?: (event: MouseEvent, status: MouseEventState) => void;
  onDrag?: (event: MouseEvent, status: MouseEventState) => void;
  onDragFinsih?: (event: MouseEvent, status: MouseEventState) => void;
  onHovering?: (event: MouseEvent, status: MouseEventState) => void;
  onHoverStart?: (event: MouseEvent, status: MouseEventState) => void;
  onHoverEnd?: (event: MouseEvent, status: MouseEventState) => void;
  onMouseDown?: (event: MouseEvent, status: MouseEventState) => void;
  onMouseUp?: (event: MouseEvent, status: MouseEventState) => void;
}

const isExcept = <T extends Element>(
  dom: T,
  excepts: MouseDetectClicknDragOpts["except"],
) => {
  if (excepts === undefined) return false;

  return excepts.some((e) => {
    if (typeof e === "string") return dom.classList.contains(e) ?? false;
    else return dom.isSameNode(e.current) ?? false;
  });
};

export default function useMouseDetectClicknDrag<T extends HTMLElement>(
  ref: RefObject<T>,
  deps: DependencyList,
  opts: MouseDetectClicknDragOpts,
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
    delta = 3,
    strict = false,
    except = [],
  } = opts;

  enum MOUSESTATE {
    IDLE = -1,
    CLICK,
    DRAG,
  }
  const mouseState = useRef(MOUSESTATE.IDLE);
  const startMousePos = useRef<{ x: number; y: number }>();
  const [mouseDownPos, setMouseDownPos] = useState<{ x: number; y: number }>();
  const [mouseUpPos, setMouseUpPos] = useState<{ x: number; y: number }>();
  const [isDrag, setIsDrag] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const defaultPos = { x: 0, y: 0 };

  const states = useMemo(
    () => ({
      mouseDownPos: mouseDownPos ?? defaultPos,
      mouseUpPos: mouseUpPos ?? defaultPos,
      isHover,
      isDrag,
    }),
    [mouseDownPos, mouseUpPos, isHover, isDrag],
  );

  const handleMouseDown = (e: MouseEvent) => {
    onMouseDown?.(e, states);
    startMousePos.current = { x: e.pageX, y: e.pageY };
    mouseState.current = 0;

    setMouseDownPos(startMousePos.current);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const element = e.target as T;

      if (strict && !ref.current?.isSameNode(element)) {
        if (!isExcept(element, except)) {
          handleMouseLeave(e);
          return;
        }
      }
      if (mouseState.current < 0) {
        onHovering?.(e, states);
      }
      if (startMousePos.current === undefined) {
        return;
      }

      if (mouseState.current > 0) {
        setIsDrag(true);
        onDrag?.(e, states);
      }

      const diffX = Math.abs(e.pageX - startMousePos.current.x);
      const diffY = Math.abs(e.pageY - startMousePos.current.y);
      if ((mouseState.current === 0 && diffX >= delta) || diffY >= delta) {
        mouseState.current = 1;
        return;
      }
    },
    [onHovering, onDrag],
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      setMouseUpPos({ x: e.pageX, y: e.pageY });
      onMouseUp?.(e, states);
      resetState();
      if (!startMousePos.current) return;
      const diffX = Math.abs(e.pageX - startMousePos.current.x);
      const diffY = Math.abs(e.pageY - startMousePos.current.y);
      if (mouseState.current === 0 && diffX < delta && diffY < delta) {
        onClick?.(e, states);
      } else if (mouseState.current > 1) {
        onDragFinsih?.(e, states);
      }
      mouseState.current = -1;
      startMousePos.current = undefined;
    },
    [onMouseUp, onClick, onDragFinsih],
  );

  const resetState = () => {
    setMouseUpPos(undefined);
    setMouseDownPos(undefined);
    setIsDrag(false);
    setIsHover(true);
  };

  const handleMouseEnter = (e: MouseEvent) => {
    onHoverStart?.(e, states);
    setIsHover(true);
  };

  const handleMouseLeave = (e: MouseEvent) => {
    if (mouseState.current === 1) handleMouseUp(e);
    startMousePos.current = undefined;
    onHoverEnd?.(e, states);
    setIsHover(false);
  };

  useEffect(() => {
    ref.current?.addEventListener("mouseover", handleMouseEnter);
    ref.current?.addEventListener("mouseout", handleMouseLeave);
    ref.current?.addEventListener("mousedown", handleMouseDown);
    ref.current?.addEventListener("mousemove", handleMouseMove);
    ref.current?.addEventListener("mouseup", handleMouseUp);
    return () => {
      ref.current?.removeEventListener("mouseover", handleMouseEnter);
      ref.current?.removeEventListener("mouseout", handleMouseLeave);
      ref.current?.removeEventListener("mousedown", handleMouseDown);
      ref.current?.removeEventListener("mousemove", handleMouseMove);
      ref.current?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [...deps, mouseState.current]);
}
