import { ChangeEvent, useState } from "react";

interface MouseDetectClicknDragProps<T> {
  onClick?: (event: React.MouseEvent<T>) => void;
  onDrag?: (event: React.MouseEvent<T>) => void;
  onDragFinsih?: (event: React.MouseEvent<T>) => void;
  onHovering?: (event: React.MouseEvent<T>) => void;
  onHoverStart?: (event: React.MouseEvent<T>, ...args: unknown[]) => void;
  onHoverEnd?: (event: React.MouseEvent<T>, ...args: unknown[]) => void;
}

function assertIsNode(e: EventTarget | null): asserts e is Node {
  if (!e || !("nodeType" in e)) {
    throw new Error(`Node expected`);
  }
}
export default function useMouseDetectClicknDrag<T extends HTMLElement>(
  props: MouseDetectClicknDragProps<T>,
) {
  const {
    onClick,
    onDrag,
    onDragFinsih,
    onHovering,
    onHoverEnd,
    onHoverStart,
  } = props;

  const [isDrag, setIsDrag] = useState(-1);

  const handleMouseDown = (e: React.MouseEvent<T>) => {
    setIsDrag(0);
  };
  const handleMouseMove = (e: React.MouseEvent<T>) => {
    assertIsNode(e.target);
    if (!e.currentTarget.contains(e.target)) {
      handleMouseLeave(e);
      return;
    }
    if (isDrag > 0) onDrag?.(e);
    if (isDrag === 0) setIsDrag(1);
    onHovering?.(e);
  };
  const handleMouseUp = (e: React.MouseEvent<T>) => {
    if (isDrag) onDragFinsih?.(e);
    else if (onClick) {
      onClick(e);
    }

    setIsDrag(-1);
  };

  const handleMouseEnter = (e: React.MouseEvent<T>, ...args: unknown[]) => {
    onHoverStart?.(e, ...args);
  };

  const handleMouseLeave = (e: React.MouseEvent<T>, ...args: unknown[]) => {
    onHoverEnd?.(e, ...args);
  };

  const mouseProps = {
    onMouseUp: handleMouseUp,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
  };
  return mouseProps;
}
