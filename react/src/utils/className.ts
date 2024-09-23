export type ClassUtil = {
  join: (...args: string[]) => string;
};

const classUtil: ClassUtil = {
  join(...args: string[]) {
    return args.map((arg) => arg.trim()).join(" ");
  },
};

export default classUtil;
