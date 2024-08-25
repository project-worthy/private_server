import { useMemo, useState } from "react";

export default function Devices({
  name,
  tag,
  devicePos,
  offset,
  deviceMapBBox,
}) {
  return (
    <section
      className="absolute"
      style={{
        left: offset.x + devicePos.x,
        top: offset.y + (deviceMapBBox.height - devicePos.y),
      }}
    >
      {tag === "CCTV" && <CCTV name={name} />}
      {tag === "IOT" && (
        <IOT name={name} devicePos={devicePos} deviceMapBBox={deviceMapBBox} />
      )}
    </section>
  );
}

function CCTV({ name }) {
  return (
    <div
      id="CCTV"
      className="w-[10px] h-[10px] bg-white rounded-full"
      style={{
        transform: `translate(calc(2px - 50%),calc(2px - 50%))`,
      }}
    ></div>
  );
}

function IOT({ name, devicePos, deviceMapBBox }) {
  // 0: stop, 1: run, 2: pause
  const [runningState, setRunningState] = useState(false);

  const handleClick = () => alert("IOT device clicked!");
  const integerSign = (num) => (num > 0 ? -1 : 0);

  const absX = Math.abs(devicePos.x);
  const absY = Math.abs(devicePos.y);

  const leftRightX = Math.min(devicePos.x, 0);
  const leftRightY = Math.min(devicePos.y, 0);
  return (
    <>
      <div
        className="w-[30px] h-[30px] bg-white rounded-lg cursor-pointer"
        style={{
          transform: `translate(calc(2px - 50%),calc(2px - 50%))`,
        }}
        onClick={handleClick}
      ></div>
      <svg
        className="absolute"
        viewBox={`${leftRightX} ${leftRightY} ${absX} ${absY}`}
        style={{
          width: `${absX}px`,
          height: `${absY}px`,
          top: 0,
          transform: `translate(calc(${100 * integerSign(devicePos.x)}% + 2px),0)`,
          zIndex: -1,
        }}
      >
        <path
          d={`m${devicePos.x},${0}l${-devicePos.x},${devicePos.y}`}
          style={{
            stroke: "white",
            strokeWidth: "4px",
            strokeDasharray: "8",
          }}
        ></path>
      </svg>
    </>
  );
}
