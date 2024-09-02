import Chart from "chart.js/auto";
import { useRef, useEffect, useState } from "react";
import { Utils } from "../utils/chart";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ChartButtonIdleSx, ChartButtonActiveSx } from "../theme";
import { IconSx } from "../utils/theme";
import { useResize } from "../hooks/useResize";

const options = {
  responsive: true,
  resizeDelay: 300,
  bezierCurve: true,
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      // grid line settings
      grid: {
        drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
    },
  },
};
export default function WattUsage({ closePopup }) {
  const [chartButtonActive, setChartButtonActive] = useState(0); // [0, 1, 2, 3, 4
  const chartRef = useRef(null);
  const chartCanvasRef = useRef(null);
  useResize(
    () => {
      console.log(chartRef.current);
      if (chartRef.current) chartRef.current.resize();
    },
    { delay: 200 },
  );
  useEffect(() => {
    chartRef.current = new Chart(chartCanvasRef.current, {
      type: "line",
      data: {
        labels: Utils.month({ abbreviation: true }),
        datasets: [
          {
            label: "전력 사용량",
            data: [12, 24, 32, 45, 33, 66, 99, 121, 1, 10, 120, 5],
            borderColor: "#fb0",
            backgroundColor: "#fb0",
            lineTension: 0.3,
            yAxisID: "y",
          },
          {
            label: "온도",
            data: Utils.number({ count: 12, random: true }),
            borderColor: "#EC6666",
            backgroundColor: "#EC6666",
            lineTension: 0.3,
            yAxisID: "y1",
          },
        ],
      },
      options,
    });

    return () => {
      chartRef.current.destroy();
      // window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sxWithState = (index) =>
    chartButtonActive === index ? ChartButtonActiveSx : ChartButtonIdleSx;
  return (
    <div className="p-4 text-primary">
      <div className="flex justify-end">
        <IconButton onClick={closePopup}>
          <CloseIcon sx={IconSx} />
        </IconButton>
      </div>
      <div className="font-bold text-lg py-4">콘센트 기록</div>
      <section className="flex w-full justify-between px-4">
        <Button sx={sxWithState(0)} onClick={() => setChartButtonActive(0)}>
          하루
        </Button>
        <Button sx={sxWithState(1)} onClick={() => setChartButtonActive(1)}>
          1주일
        </Button>
        <Button sx={sxWithState(2)} onClick={() => setChartButtonActive(2)}>
          한달
        </Button>
        <Button sx={sxWithState(3)} onClick={() => setChartButtonActive(3)}>
          1년
        </Button>
        <Button sx={sxWithState(4)} onClick={() => setChartButtonActive(4)}>
          전체
        </Button>
      </section>
      <div className="relative" style={{ width: "100%" }}>
        <canvas id="testing" ref={chartCanvasRef}></canvas>
      </div>
    </div>
  );
}
