import { useState } from "react";

interface MouseDetectClicknDragProps<T> {
  onClick?: (event: React.MouseEvent<T>) => void;
  onDrag?: (event: React.MouseEvent<T>) => void;
  onDragFinsih?: (event: React.MouseEvent<T>) => void;
}

export default function useMouseDetectClicknDrag<T extends HTMLElement>(
  props: MouseDetectClicknDragProps<T>,
) {
  const { onClick, onDrag, onDragFinsih } = props;
  const [isDrag, setIsDrag] = useState(-1);

  const handleMouseDown = () => setIsDrag(0);
  const handleMouseMove = (e: React.MouseEvent<T>) => {
    if (isDrag > 0) onDrag?.(e);
    if (isDrag == 0) setIsDrag(1);
  };
  const handleMouseUp = (e: React.MouseEvent<T>) => {
    if (isDrag) onDragFinsih?.(e);
    else onClick?.(e);

    setIsDrag(-1);
  };

  const mouseProps = {
    onMouseUp: handleMouseUp,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
  };
  return mouseProps;
}
