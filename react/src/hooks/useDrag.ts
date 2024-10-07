import { useEffect, useRef, useState } from "react";

import type { RefObject } from "react";

export default function useDragEvent<T extends HTMLElement>(ref: RefObject<T>) {
  const [isDrag, setIsDrag] = useState(false);

  const mouseUp = () => {
    setIsDrag(false);
    console.log("up");
  };
  const mouseDown = () => {
    setIsDrag(true);
    console.log("down");
  };
  const mouseMove = () => {
    if (isDrag) console.log("drag");
  };

  useEffect(() => {
    const node = ref.current;
    node?.addEventListener("mouseup", mouseUp);
    node?.addEventListener("mousedown", mouseDown);
    node?.addEventListener("mousemove", mouseMove);
    return () => {
      node?.removeEventListener("mouseup", mouseUp);
      node?.removeEventListener("mousedown", mouseDown);
      node?.removeEventListener("mousemove", mouseMove);
    };
  }, []);
}
