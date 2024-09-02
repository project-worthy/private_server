import { useContext, useEffect, useState } from "react";
import DevicesMap from "../components/DevicesMap";
import { DevicesContext } from "../components/DevicesProvider";
import SearchClient from "../components/SearchClient";
import WattUsage from "../components/WattUsage";
import cs from "../utils/class";

function Home() {
  const [popWidth, setPopWidth] = useState(0);
  const { devices } = useContext(DevicesContext);

  const gridRadius = 2;
  useEffect(() => {
    document.documentElement.style.setProperty("--d", `${gridRadius}px`);
  }, []);

  const openPopup = () => setPopWidth(50);
  const closePopup = () => setPopWidth(0);

  return (
    <div className="w-lvw h-lvh overflow-hidden">
      <div className="w-full h-full flex justify-center fixed z-10 pointer-events-none">
        <div className="flex-grow flex justify-center mt-10">
          <SearchClient className="pointer-events-auto" />
        </div>
        {popWidth > 0 && (
          <div
            className={cs.join("p-5 transition-all pointer-events-auto")}
            style={{ width: `${popWidth}vw`, maxWidth: "500px" }}
          >
            <div className="rounded-xl bg-blend h-full w-full">
              <WattUsage closePopup={closePopup} />
            </div>
          </div>
        )}
      </div>
      <DevicesMap
        deviceArray={devices}
        gridRadius={gridRadius}
        openPopup={openPopup}
        closePopup={closePopup}
      />
    </div>
  );
}

export default Home;
