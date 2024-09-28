import { useState } from "react";

import { Add as AddIcon } from "@mui/icons-material";
import { Autocomplete, IconButton, TextField } from "@mui/material";

import Icon from "./Icon";
import Tag from "./Tag";

import type { TagType } from "./Tag";

export type TagsProps = {
  data?: TagType[];
  selected?: TagType[];
  onTagAdd?: (tag: TagType) => void;
};

const checkOptionsExist = (arr: TagType[], target: string) =>
  arr.some((e) => e.label === target);

//TODO: need to make this dynamic
const tagsOptions = [
  { label: "asd1", color: "#707070" },
  { label: "asd2", color: "#d1e3d6" },
  { label: "asd3", color: "#102020" },
];

export default function Tags(props: TagsProps) {
  const { data, onTagAdd } = props;
  const options = data ?? [];

  const [optionsExist, setOptionsExist] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setOptionsExist(checkOptionsExist(options, value));
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Autocomplete<TagType, true>
          multiple
          limitTags={2}
          id="multiple-limit-tags"
          options={tagsOptions}
          defaultValue={data}
          onInputChange={(_, v) => handleInputChange(v)}
          getOptionLabel={(o) => o.label}
          renderTags={(tags) => {
            return (
              <>
                {tags.map((tag, i) => (
                  <Tag tagData={tag} key={`tag-${i}`} />
                ))}
              </>
            );
          }}
          size="small"
          renderInput={(params) => <TextField {...params} placeholder="태그" />}
          style={{ width: "100%" }}
        />
      </div>
      {!optionsExist && (
        <IconButton
          onClick={() => onTagAdd?.({ label: inputValue, color: "#707070" })}
        >
          <Icon>
            <AddIcon />
          </Icon>
        </IconButton>
      )}
    </div>
  );
}
