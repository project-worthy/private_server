import TextField from "@mui/material/TextField";

import { ReactComponent as Search } from "../icons/searchIcon.svg";
import cs from "../utils/class";
import { SearchSx } from "../utils/theme";
function SearchClient({ className }) {
  return (
    <div
      className={cs.join(
        "bg-blend px-4 h-fit rounded-full shadow-black flex items-center",
        className,
      )}
    >
      <Search width={32} height={32} />
      <TextField className="w-[33vw] min-w-[300px]" sx={SearchSx} />
    </div>
  );
}

export default SearchClient;
