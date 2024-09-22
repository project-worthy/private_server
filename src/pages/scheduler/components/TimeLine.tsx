import { locale } from "dayjs";

import { Box } from "components/layouts";

import TimeSchedulerDetail from "./TimeSchedulerDetail";
import TimeSchedulerInfo from "./TimeSchedulerInfo";

import type { TimeSchedulerType } from "../types";

locale("ko");

const timeWidth = 64;

const timeNumber: number[] = Array.from({ length: 24 }, (_, i) => i + 1);

type TimeLineProps = {
  dataSource: TimeSchedulerType[];
};

export default function TimeLine(props: TimeLineProps) {
  const { dataSource } = props;
  // const [dataSource, _] = useState(dataSource);
  return (
    <>
      <Box className="h-full " items="start">
        <div className="relative w-full h-full">
          <div className="overflow-x-scroll h-full">
            <div className="w-full" style={{ marginLeft: "calc(25% + 1rem)" }}>
              <div className="inline-flex">
                {timeNumber.map((v) => (
                  <div
                    className=" h-5 sticky"
                    key={"time" + v}
                    style={{ width: timeWidth, left: "calc(25% + 1rem)" }}
                  >
                    <span className="right-0 translate-x-1/2 bg-background text-primary">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-12 mb-2">
                {dataSource.map((d, i) => (
                  <>
                    <TimeSchedulerInfo
                      data={d}
                      key={`time-scheduler-info-${i}`}
                    />
                    <TimeSchedulerDetail
                      data={d}
                      timeWidth={timeWidth}
                      key={`time-scheduler-detail-${i}`}
                    />
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
}
