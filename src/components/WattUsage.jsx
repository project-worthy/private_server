import Chart from "chart.js/auto";
import { useRef, useEffect } from "react";
import Utils from "../utils/chart";

export default function WattUsage() {
  const chartRef = useRef(null);
  useEffect(() => {
    const data = [{ year: 2010, count: 10 }];

    console.log(Utils.number({ random: true }));
    const myLineChart = new Chart(chartRef.current, {
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
      options: {
        // responsive: true,
        // interaction: {
        //   mode: "index",
        //   intersect: false,
        // },
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
      },
    });

    return () => {
      myLineChart.destroy();
    };
  }, []);
  return (
    <div>
      <section className="flex w-full justify-between px-4">
        <button className="text-primary">하루</button>
        <button className="text-primary">1 주일</button>
        <button className="text-primary">한 달</button>
        <button className="text-primary">1 년</button>
        <button className="text-primary">전체</button>
      </section>
      <div className="w-full">
        <canvas id="testing" ref={chartRef}></canvas>
      </div>
    </div>
  );
}
