import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, Paper } from "@mui/material";

const dummyData: string[][] = [["2024-09-25 00:0:0", "2024-09-25 03:0:0"]];
export default function TimeScheduler() {
  return (
    <>
      <div className="absolute flex items-center justify-between left-0 top-auto w-1/4 bg-background px-2 z-10">
        <dl>
          <dt>디바이스 이름</dt>
          <dd>AE:32:43:FA</dd>
        </dl>
        <IconButton>
          <MoreHorizIcon />
        </IconButton>
      </div>
      <div className="h-[inherit] relative" style={{ width: 300 }}>
        {dummyData.map((data, i) => (
          <>
            <span className="absolute left-0">00:00</span>
            <span className="absolute right-0">00:00</span>
            <p
              className="absolute h-0.5 rounded-lg bg-primary top-1/2 -translate-y-1/2 w-full"
              key={"line" + i}
            ></p>
          </>
        ))}
      </div>
    </>
  );
}
