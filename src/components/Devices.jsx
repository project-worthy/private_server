import { useMemo, useState } from "react";

export default function Devices({ device, offset, deviceMapBBox, onClick }) {
  const devicePos = {
    x: device?.position?.x ?? 0,
    y: device?.position?.y ?? 0,
  };
  const tag = device.tag;
  const name = device.name;

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
        <IOT device={device} deviceMapBBox={deviceMapBBox} onClick={onClick} />
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

function IOT({ device, onClick }) {
  const devicePos = {
    x: device?.position?.x ?? 0,
    y: device?.position?.y ?? 0,
  };

  const absX = Math.abs(devicePos.x);
  const absY = Math.abs(devicePos.y);

  const leftRightX = Math.min(devicePos.x, 0);
  const leftRightY = Math.min(devicePos.y, 0);

  const integerSign = (num) => (num > 0 ? -1 : 0);

  const handleState = (state) => {
    if (state === "IDLE") return "#d2ffb0";
    else if (state === "PAUSED") return "#ffd469";
    else if (state === "STOPPED") return "#ffab8c";
  };

  return (
    <>
      <div
        className="w-[30px] h-[30px] bg-white rounded-lg cursor-pointer"
        style={{
          transform: `translate(calc(2px - 50%),calc(2px - 50%))`,
          border: `solid 4px ${handleState(device.state)}`,
        }}
        onClick={() => onClick(device?.id)}
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
