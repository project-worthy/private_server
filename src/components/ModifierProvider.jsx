import { createContext, useEffect, useState, useRef } from "react";
export const ModifierContext = createContext();
function ModifierProvider({ children }) {
  const [isCtrl, setIsCtrl] = useState(false);
  function modifierUpHandler(e) {
    if (e.keyCode === 17) setIsCtrl(false);
  }
  function modifierDownHandler(e) {
    if (e.keyCode === 17) setIsCtrl(false);
  }
  useEffect(() => {
    window.addEventListener("keydown", modifierDownHandler);
    window.addEventListener("keyup", modifierUpHandler);
    return () => {
      window.removeEventListener("keyup", modifierDownHandler);
      window.removeEventListener("keydown", modifierDownHandler);
    };
  }, []);
  const contextValue = {
    isCtrl,
  };
  return (
    <ModifierContext.Provider value={contextValue}>
      {children}
    </ModifierContext.Provider>
  );
}

export default ModifierProvider;
