import { ReactNode, useRef, useEffect, useState } from "react";

import { Popper as MuiPopover } from "@mui/material";
import { PopperProps as MuiPopperProps } from "@mui/material";

type PopoverProps = {
  content?: JSX.Element;
  children: React.ReactElement;
  onVisibleChange?: () => void;
  trigger?: "click" | "focus" | "hover";
} & Omit<MuiPopperProps, "anchorEl" | "open" | "content">;

const getChild = <T extends Element>(data?: T | null): Element | null => {
  if (!data) return null;
  if (data.classList.contains("muiCustom-popper-wrapper"))
    return getChild(data.children[0]);
  return data;
};

export default function Popover(props: PopoverProps) {
  const { content, children, trigger: _trigger, ...others } = props;

  const trigger = _trigger ?? "hover";

  const anchorRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handlePopoverOpen = () => {
    setIsOpen(true);
  };
  const handlePopoverClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const child = getChild(anchorRef.current);
    console.log(trigger);
    if (trigger === "hover") {
      child?.addEventListener("mouseenter", handlePopoverOpen);
      child?.addEventListener("mouseleave", handlePopoverClose);
    }
    if (trigger === "click") {
      child?.addEventListener("click", handlePopoverOpen);

      wrapperRef.current?.addEventListener("click", handlePopoverClose);
    }
    if (trigger === "focus")
      child?.addEventListener("focus", handlePopoverOpen);

    return () => {
      child?.removeEventListener("mouseenter", handlePopoverOpen);
      child?.removeEventListener("mouseleave", handlePopoverClose);
      child?.removeEventListener("click", handlePopoverOpen);
      wrapperRef.current?.removeEventListener("click", handlePopoverClose);
    };
  }, []);
  return (
    <>
      <div className="muiCustom-popper-wrapper" ref={anchorRef}>
        {children}
        {
          <div
            className="fixed w-lvw h-lvh top-0 left-0"
            ref={wrapperRef}
            style={{
              visibility: isOpen && trigger === "click" ? "visible" : "hidden",
            }}
          ></div>
        }
        <MuiPopover
          {...others}
          open={isOpen}
          anchorEl={getChild(anchorRef.current)}
        >
          {content}
        </MuiPopover>
      </div>
    </>
  );
}
