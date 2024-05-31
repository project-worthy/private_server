import { useEffect, useRef, useState } from "react";
import SearchClient from "../components/SearchClient";
import cs from "../utils/class";
import Draggable from "react-draggable";
function Home() {
  const [popWidth, setPopWidth] = useState(0);
  const [initSize, setInitSize] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef();
  useEffect(() => {
    let x = Math.floor(-dragRef.current.offsetWidth / 2);
    let y = Math.floor(-dragRef.current.offsetHeight / 2);
    x = x - (x % 20);
    y = y - (y % 20);
    setPos({
      x,
      y,
    });
    setInitSize({
      x,
      y,
    });
  }, []);

  const onStop = (e, data) => {
    setPos({
      x: initSize.x + (data.x % 20),
      y: initSize.y + (data.y % 20),
    });
  };
  return (
    <div className="w-lvw h-lvh overflow-hidden">
      <div className="w-full h-full flex justify-center fixed z-10 pointer-events-none">
        <div className="flex-grow flex justify-center mt-10">
          <SearchClient className="pointer-events-auto" />
        </div>
        <div className={cs.join(`w-[${popWidth}vw]`, " p-5 transition-all")}>
          <div className="rounded-xl bg-blend h-full w-full"></div>
          {/*devices information is going to go*/}
        </div>
      </div>
      <Draggable nodeRef={dragRef} onStop={onStop} position={pos}>
        <div
          className="dot-grid bg-[0 0 / 20px 20px] w-[300vw] h-[300vh]"
          ref={dragRef}
        ></div>
      </Draggable>
    </div>
  );
}

export default Home;
