import Draggable from "react-draggable";
import Devices from "./Devices";

import { useEffect, useMemo, useRef, useState } from "react";
export default function DevicesMap({ deviceArray, gridRadius, openPopup }) {
  const [totalDragSize, setTotalDragSize] = useState({ x: 0, y: 0 });
  // 20 사이즈 맞추기 위해서 사용하는 애

  const [gridAlignOffset, setGridAlignOffset] = useState({ x: 0, y: 0 });
  const [deviceMapBBox, setDeviceMapBBox] = useState({
    width: 0,
    height: 0,
    offsetWidth: 0,
    offsetHeight: 0,
  });

  const initialBgPosRef = useRef(null);
  const dragRef = useRef(null);

  const onStop = (_, data) => {
    const deltaX = data.x - gridAlignOffset.x;
    const deltaY = data.y - gridAlignOffset.y;
    setGridAlignOffset({
      x: initialBgPosRef.current.x + (data.x % 20),
      y: initialBgPosRef.current.y + (data.y % 20),
    });
    setTotalDragSize({
      x: totalDragSize.x + deltaX,
      y: totalDragSize.y + deltaY,
    });
  };

  const getCenter = (divicesMapSize, gridSize = 20) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const getOffset = (a, b) => Math.floor(a - b) / 2;

    const curCenterOffsetX = getOffset(screenWidth, divicesMapSize.width);
    const curCenterOffsety = getOffset(screenHeight, divicesMapSize.height);

    return {
      offsetWidth: curCenterOffsetX - (curCenterOffsetX % gridSize),
      offsetHeight: curCenterOffsety - (curCenterOffsety % gridSize),
    };
  };

  const getDeviceLayoutBBox = (devices, gridSize = 20) => {
    const sortArray = (arr, func) => arr.sort((a, b) => func(a) - func(b));

    const xSortedArr = sortArray(devices, (e) => e?.position?.x ?? 0);
    const ySOrtedArr = sortArray(devices, (e) => e?.position?.y ?? 0);

    const maxX = xSortedArr[xSortedArr.length - 1]?.position?.x ?? 0;
    const maxY = ySOrtedArr[ySOrtedArr.length - 1]?.position?.y ?? 0;
    const minX = xSortedArr[0]?.position?.x ?? 0;
    const minY = ySOrtedArr[0]?.position?.y ?? 0;
    const center = getCenter(
      { width: maxX - minX, height: maxY - minY },
      gridSize,
    );

    const width = maxX - minX;
    const height = maxY - minY;

    return {
      width: width - (width % gridSize),
      height: height - (height % gridSize),
      ...center,
    };
  };

  const abjustGrid = (x, y) => ({ x: x - (x % 20), y: y - (y % 20) });

  useEffect(() => {
    let x = -dragRef.current.scrollWidth / 3;
    let y = -dragRef.current.scrollHeight / 3;
    const initialPos = abjustGrid(x, y);
    setGridAlignOffset(initialPos);
    initialBgPosRef.current = initialPos;
    setDeviceMapBBox(getDeviceLayoutBBox(deviceArray));
  }, [deviceArray]);

  const offset = useMemo(() => {
    return {
      x:
        Math.abs(gridAlignOffset.x) +
        deviceMapBBox.offsetWidth +
        totalDragSize.x,
      y:
        Math.abs(gridAlignOffset.y) +
        deviceMapBBox.offsetHeight +
        totalDragSize.y,
    };
  }, [gridAlignOffset, totalDragSize, deviceMapBBox]);

  const handleClickDevice = (e) => {
    console.log(e);
    openPopup();
  };

  return (
    <Draggable nodeRef={dragRef} onStop={onStop} position={gridAlignOffset}>
      <div className="dot-grid w-[300vw] h-[300vh] relative" ref={dragRef}>
        {deviceArray?.map((device, idx) => {
          return (
            <Devices
              // name={device.name}
              // tag={device.tag}
              // devicePos={{
              //   x: device?.position?.x ?? 0,
              //   y: device?.position?.y ?? 0,
              // }}
              device={device}
              deviceMapBBox={deviceMapBBox}
              offset={offset}
              key={`devices-${idx}`}
              onClick={handleClickDevice}
            />
          );
        })}
      </div>
    </Draggable>
  );
}
