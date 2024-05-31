export const TextFieldSx = {
  "& input": {
    color: "rgba(var(--secondary))",
  },
  "& label": {
    color: "rgba(var(--secondary))",
  },
  "& label.Mui-focused": {
    color: "rgba(var(--primary))",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "rgba(var(--highlight))",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(var(--secondary))",
    },
    "&:hover fieldset": {
      borderColor: "rgba(var(--highlight))",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(var(--highlight))",
    },
  },
};

export const SearchSx = (type) => {
  const placeholderCss = {
    textAlign: "end",
  };
  if (type === "macos") {
    placeholderCss["backgroundImage"] =
      `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='%23e8eaed'%3E%3Cpath d='M260-130q-54.15 0-92.08-37.92Q130-205.85 130-260t37.92-92.08Q205.85-390 260-390h70v-180h-70q-54.15 0-92.08-37.92Q130-645.85 130-700t37.92-92.08Q205.85-830 260-830t92.08 37.92Q390-754.15 390-700v70h180v-70q0-54.15 37.92-92.08Q645.85-830 700-830t92.08 37.92Q830-754.15 830-700t-37.92 92.08Q754.15-570 700-570h-70v180h70q54.15 0 92.08 37.92Q830-314.15 830-260t-37.92 92.08Q754.15-130 700-130t-92.08-37.92Q570-205.85 570-260v-70H390v70q0 54.15-37.92 92.08Q314.15-130 260-130Zm0-60q28.85 0 49.42-20.58Q330-231.15 330-260v-70h-70q-28.85 0-49.42 20.58Q190-288.85 190-260t20.58 49.42Q231.15-190 260-190Zm440 0q28.85 0 49.42-20.58Q770-231.15 770-260t-20.58-49.42Q728.85-330 700-330h-70v70q0 28.85 20.58 49.42Q671.15-190 700-190ZM390-390h180v-180H390v180ZM260-630h70v-70q0-28.85-20.58-49.42Q288.85-770 260-770t-49.42 20.58Q190-728.85 190-700t20.58 49.42Q231.15-630 260-630Zm370 0h70q28.85 0 49.42-20.58Q770-671.15 770-700t-20.58-49.42Q728.85-770 700-770t-49.42 20.58Q630-728.85 630-700v70Z'/%3E%3C/svg%3E%0A")`;
    placeholderCss["backgroundRepeat"] = "no-repeat";
    placeholderCss["backgroundSize"] = "contain";
    placeholderCss["backgroundPositionX"] = "calc(100% - 25px)";
  }
  return {
    "& input": {
      color: "rgba(var(--secondary))",
      "&::placeholder": placeholderCss,
    },
    "& label": {
      color: "rgba(var(--secondary))",
    },
    "& label.Mui-focused": {
      color: "rgba(var(--primary))",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "rgba(var(--highlight))",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(0,0,0,0)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0,0,0,0)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgba(0,0,0,0)",
      },
    },
  };
};
