const cs = {
  join: (...args) => {
    const trimed = args.map((arg) => arg.trim());
    return trimed.join(" ");
  },
};

export default cs;
