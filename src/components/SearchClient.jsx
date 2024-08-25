import TextField from "@mui/material/TextField";
import { isMacOs } from "react-device-detect";

import { ReactComponent as Search } from "../icons/searchIcon.svg";
import cs from "../utils/class";
import { SearchSx } from "../utils/theme";
import { useKeyCode, usePreventKeyCode } from "../hooks";
import { useEffect, useRef } from "react";

function SearchClient({ className }) {
  const cmdKDown = useKeyCode(75, { meta: true });
  const escDown = useKeyCode(27);
  const textFieldRef = useRef(null);
  useEffect(() => {
    if (cmdKDown) {
      textFieldRef.current.focus();
    }
  }, [cmdKDown]);

  useEffect(() => {
    if (escDown) {
      textFieldRef.current.blur();
      textFieldRef.current.value = "";
    }
  }, [escDown]);
  return (
    <div
      className={cs.join(
        "bg-blend px-4 h-fit rounded-full shadow-black flex items-center",
        className,
      )}
    >
      <Search width={32} height={32} />
      <TextField
        className="w-[33vw] min-w-[300px]"
        placeholder={`${isMacOs ? "" : "ctrl"} + k`}
        sx={SearchSx(isMacOs ? "macos" : "")}
        inputRef={textFieldRef}
      />
    </div>
  );
}

export default SearchClient;
