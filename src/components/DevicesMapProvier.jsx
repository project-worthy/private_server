import { createContext } from "react";
export const DevicesContext = createContext();

export default function DevicesProvider({ children }) {
  return <DevicesContext.Provider>{children}</DevicesContext.Provider>;
}
