import { useEffect, useState, useRef, RefObject } from "react";

export type MouseState = {
  isDrag: boolean;
  isClick: boolean;
};

interface MouseDetectClicknDragProps<T> {
  onClick?: (event: React.MouseEvent<T>) => void;
  onDrag?: (event: React.MouseEvent<T>) => void;
  onDragFinsih?: (event: React.MouseEvent<T>) => void;
  onHovering?: (event: React.MouseEvent<T>, states: MouseState) => void;
  onHoverStart?: (event: React.MouseEvent<T>, ...args: unknown[]) => void;
  onHoverEnd?: (event: React.MouseEvent<T>, ...args: unknown[]) => void;
}
interface MouseDetectClicknDrag<T> {
  onMouseDown: (event: React.MouseEvent<T>) => void;
  onMouseMove: (event: React.MouseEvent<T>) => void;
  onMouseLeave: (event: React.MouseEvent<T>) => void;
  onMouseEnter: (event: React.MouseEvent<T>) => void;
  onMouseUp: (event: React.MouseEvent<T>) => void;
}

function assertIsNode(e: EventTarget | null): asserts e is Node {
  if (!e || !("nodeType" in e)) {
    throw new Error(`Node expected`);
  }
}

const delta = 3;
export default function useMouseDetectClicknDrag<T extends HTMLElement>(
  props: MouseDetectClicknDragProps<T>,
): [RefObject<T>] {
  const {
    onClick,
    onDrag,
    onDragFinsih,
    onHovering,
    onHoverEnd,
    onHoverStart,
  } = props;

  const isDrag = useRef(-1);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>();

  const detectRef = useRef<T>(null);

  const handleMouseDown = (e: MouseEvent) => {
    setStartPos({ x: e.pageX, y: e.pageY });
    isDrag.current = 0;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDrag.current < 0) {
      console.log("hovering");
    }
    console.log(isDrag.current, startPos);
    if (startPos === undefined) {
      return;
    }
    const diffX = Math.abs(e.pageX - startPos.x);
    const diffY = Math.abs(e.pageY - startPos.y);
    if ((isDrag.current === 0 && diffX >= delta) || diffY >= delta) {
      isDrag.current = 1;
      return;
    }
    if (isDrag.current > 0) {
      console.log("draging");
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!startPos) return;
    const diffX = Math.abs(e.pageX - startPos.x);
    const diffY = Math.abs(e.pageY - startPos.y);
    if (diffX < delta && diffY < delta) {
      console.log("click");
    } else if (isDrag.current > 1) {
      console.log("dragFinish");
    }
    isDrag.current = -1;
  };

  const handleMouseEnter = (e: MouseEvent) => {
    console.log("enter");
  };

  const handleMouseLeave = (e: MouseEvent) => {
    if (isDrag.current === 1) handleMouseUp(e);
    setStartPos(undefined);
    console.log("leave");
  };

  useEffect(() => {
    detectRef.current?.addEventListener("mouseenter", handleMouseEnter);
    detectRef.current?.addEventListener("mouseleave", handleMouseLeave);
    detectRef.current?.addEventListener("mousedown", handleMouseDown);
    detectRef.current?.addEventListener("mousemove", handleMouseMove);
    detectRef.current?.addEventListener("mouseup", handleMouseUp);
    return () => {
      detectRef.current?.removeEventListener("mouseenter", handleMouseEnter);
      detectRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      detectRef.current?.removeEventListener("mousedown", handleMouseDown);
      detectRef.current?.removeEventListener("mousemove", handleMouseMove);
      detectRef.current?.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return [detectRef];
}
