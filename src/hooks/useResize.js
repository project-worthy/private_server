import { useEffect, useRef, useState } from "react";

export function useResize(func, options) {
  const delay = options?.delay ?? 500;
  const resizeTimeout = useRef(null);

  const handleResize = () => {
    clearTimeout(resizeTimeout.current);
    resizeTimeout.current = setTimeout(() => {
      func();
    }, delay);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}
