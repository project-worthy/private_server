import { useEffect, useState } from "react";

export function useKeyCode(keyCode, opts) {
  const [keyDown, setKeyDown] = useState(false);

  useEffect(() => {
    function modifierUpHandler(e) {
      if (e.keyCode) setKeyDown(false);
    }
    function modifierDownHandler(e) {
      let modifier = true;
      if (opts?.meta) modifier = e.metaKey;
      if (opts?.ctrl) modifier = e.ctrlKey;
      if (opts?.alt) modifier = e.altKey;
      if (opts?.shift) modifier = e.shiftKey;
      if (e.keyCode === keyCode && modifier) setKeyDown(true);
    }
    window.addEventListener("keydown", modifierDownHandler);
    window.addEventListener("keyup", modifierUpHandler);
    return () => {
      window.removeEventListener("keyup", modifierDownHandler);
      window.removeEventListener("keydown", modifierDownHandler);
    };
  }, []);

  return keyDown;
}

export function usePreventKeyCode(keyCodes) {
  useEffect(() => {
    function modifierDownHandler(e) {
      if (keyCodes.includes(e.keyCode)) e.preventDefault();
    }
    window.addEventListener("keydown", modifierDownHandler);
    return () => {
      window.removeEventListener("keydown", modifierDownHandler);
    };
  }, [keyCodes]);
}
