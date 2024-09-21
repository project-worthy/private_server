import { useState } from "react";

import { Popover } from "@mui/material";

import { ChromePicker } from "react-color";

export type TagType = {
  label: string;
  color: string;
};

export type TagProps = {
  tagData: TagType;
};

export default function Tag(props: TagProps) {
  const { tagData } = props;
  const [clickElement, setClickElement] = useState<HTMLDivElement>();
  const [color, setColor] = useState(tagData.color);

  const isOpen = () => Boolean(clickElement);

  const handleClose = () => setClickElement(undefined);

  return (
    <>
      <div
        className="rounded-[50vh] px-2 mx-0.5"
        style={{ backgroundColor: color }}
        onClick={(e) => setClickElement(e.currentTarget)}
      >
        {tagData.label}
      </div>
      <Popover
        open={isOpen()}
        onClose={handleClose}
        anchorEl={clickElement}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <ChromePicker color={color} onChangeComplete={(e) => setColor(e.hex)} />
      </Popover>
    </>
  );
}
