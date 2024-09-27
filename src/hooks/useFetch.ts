import { useEffect, useState } from "react";

function asertT<T>(e: T | undefined): asserts e is T {
  if (typeof e !== "object") {
    throw new Error(`Node expected`);
  }
}

export default function useFetch<T>(path: string): [T | undefined];
export default function useFetch<T>(path: string, defaultValue: T): [T];
export default function useFetch<T>(path: string, defaultValue?: T) {
  const [data, _] = useState<T | undefined>(defaultValue);

  useEffect(() => {
    //fetch needed;
  }, []);

  return [data];
}
