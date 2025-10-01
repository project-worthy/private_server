import { useEffect, useRef, useCallback, useState, useMemo } from "react";

import { cursorTo } from "readline";

import type { RefObject, DependencyList } from "react";

export type MouseEventState = {
  isDrag: boolean;
  isHover: boolean;
  mouseUpPos: { x: number; y: number };
  mouseDownPos: { x: number; y: number };
};

export type MouseEventActions = {
  mouseleave: (event: MouseEvent) => void;
};

interface MouseDetectClicknDragOpts {
  delta?: number;
  strict?: boolean;
  except?: Array<string | RefObject<Element>>;
  onClick?: (
    event: MouseEvent,
    status: MouseEventState,
    actions: MouseEventActions,
  ) => void;
  onDrag?: (
    event: MouseEvent,
    status: MouseEventState,
    actions: MouseEventActions,
  ) => void;
  onDragFinsih?: (
    event: MouseEvent,
    status: MouseEventState,
    actions: MouseEventActions,
  ) => void;
  onHovering?: (
    event: MouseEvent,
    status: MouseEventState,
    actions: MouseEventActions,
  ) => void;
  onHoverStart?: (
    event: MouseEvent,
    status: MouseEventState,
    actions: MouseEventActions,
  ) => void;
  onHoverEnd?: (
    event: MouseEvent,
    status: MouseEventState,
    actions: MouseEventActions,
  ) => void;
  onMouseDown?: (
    event: MouseEvent,
    status: MouseEventState,
    actions: MouseEventActions,
  ) => void;
  onMouseUp?: (
    event: MouseEvent,
    status: MouseEventState,
    actions: MouseEventActions,
  ) => void;
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

export default function useMouseMouseEvents<T extends HTMLElement>(
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

  const handleMouseDown = (e: MouseEvent) => {
    onMouseDown?.(e, states, actions);
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
        onHovering?.(e, states, actions);
      }
      if (startMousePos.current === undefined) {
        return;
      }

      if (mouseState.current > 0) {
        setIsDrag(true);
        onDrag?.(e, states, actions);
      }

      const diffX = Math.abs(e.pageX - startMousePos.current.x);
      const diffY = Math.abs(e.pageY - startMousePos.current.y);
      if ((mouseState.current === 0 && diffX >= delta) || diffY >= delta) {
        mouseState.current = 1;
        return;
      }
    },
    [onHovering, onDrag, strict],
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      setMouseUpPos({ x: e.pageX, y: e.pageY });
      onMouseUp?.(e, states, actions);
      if (!startMousePos.current) return;
      const diffX = Math.abs(e.pageX - startMousePos.current.x);
      const diffY = Math.abs(e.pageY - startMousePos.current.y);
      if (mouseState.current === 0 && diffX < delta && diffY < delta) {
        onClick?.(e, states, actions);
      } else if (mouseState.current > 0) {
        onDragFinsih?.(e, states, actions);
      }
      mouseState.current = -1;
      startMousePos.current = undefined;
      resetState();
    },
    [onMouseUp, onClick, onDragFinsih, strict],
  );

  const resetState = () => {
    setMouseUpPos(undefined);
    setMouseDownPos(undefined);
    setIsDrag(false);
    setIsHover(true);
  };

  const handleMouseEnter = (e: MouseEvent) => {
    onHoverStart?.(e, states, actions);
    setIsHover(true);
  };

  const handleMouseLeave = (e: MouseEvent) => {
    if (mouseState.current === 1) handleMouseUp(e);
    startMousePos.current = undefined;
    onHoverEnd?.(e, states, actions);
    setIsHover(false);
  };
  const states = useMemo(
    () => ({
      mouseDownPos: mouseDownPos ?? defaultPos,
      mouseUpPos: mouseUpPos ?? defaultPos,
      isHover,
      isDrag,
    }),
    [mouseDownPos, mouseUpPos, isHover, isDrag],
  );
  const actions = useMemo(
    () => ({
      mouseleave: handleMouseLeave,
    }),
    [strict],
  );

  useEffect(() => {
    const mousein = strict ? "mouseover" : "mouseenter";
    const mouseout = strict ? "mouseout" : "mouseleave";
    ref.current?.addEventListener(mousein, handleMouseEnter);
    ref.current?.addEventListener(mouseout, handleMouseLeave);
    ref.current?.addEventListener("mousedown", handleMouseDown);
    ref.current?.addEventListener("mousemove", handleMouseMove);
    ref.current?.addEventListener("mouseup", handleMouseUp);
    return () => {
      ref.current?.removeEventListener(mousein, handleMouseEnter);
      ref.current?.removeEventListener(mouseout, handleMouseLeave);
      ref.current?.removeEventListener("mousedown", handleMouseDown);
      ref.current?.removeEventListener("mousemove", handleMouseMove);
      ref.current?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [...deps, mouseState.current, strict]);
}
