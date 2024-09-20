import cs from "utils/className";

type BoxProps = {
  children: React.ReactNode;
  className?: string;
  height?: number;
  items?: "center" | "start" | "end";
  justfiy?: "center" | "start" | "end";
  direction?: "vertical" | "horizontal";
};

const directionMap = {
  vertical: "flex-col",
  horizontal: "flex-row",
};

export default function Box({
  children,
  className = "",
  height,
  items = "center",
  justfiy = "center",
  direction = "horizontal",
}: BoxProps) {
  const classItems = `items-${items}`;
  const classJustify = `justify-${justfiy}`;
  const classDirection = directionMap[direction];
  return (
    <div
      className={cs.join(
        className,
        "flex px-10",
        classItems,
        classJustify,
        classDirection,
      )}
      style={{ height }}
    >
      {children}
    </div>
  );
}
