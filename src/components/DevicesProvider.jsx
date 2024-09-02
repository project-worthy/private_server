import { useEffect, createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
export const DevicesContext = createContext({});
export default function DevicesProvider({ children }) {
  const [devices, setDevices] = useState([]);
  const temp = [
    {
      name: "camera",
      position: { x: 0, y: 0 },
      tag: "CCTV",
      id: uuidv4(),
    },
    {
      name: "전기1",
      position: { x: 30, y: 20 },
      tag: "IOT",
      id: uuidv4(),
      state: "IDLE",
    },
    {
      name: "전기1",
      position: { x: 100, y: 150 },
      tag: "IOT",
      id: uuidv4(),
      state: "STOPPED",
    },
    {
      name: "전기1",
      position: { x: 300, y: 100 },
      tag: "IOT",
      id: uuidv4(),
      state: "IDLE",
    },
    {
      name: "전기1",
      position: { x: -200, y: 100 },
      tag: "IOT",
      id: uuidv4(),
      state: "PAUSED",
    },
  ];

  useEffect(function fetchDevices() {
    const _fetchDevices = async () => {
      // const res = await fetch("http://localhost:3000/devices");
      // const data = await res.json();
      // console.log(data);
      setDevices(temp);
    };
    _fetchDevices();
  }, []);

  const providerVaue = {
    devices,
  };

  return (
    <DevicesContext.Provider value={providerVaue}>
      {children}
    </DevicesContext.Provider>
  );
}
