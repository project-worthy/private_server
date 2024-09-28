import { useEffect, useState } from "react";

export default function useFetch<T>(path: string): [T | undefined];
export default function useFetch<T>(path: string, defaultValue: T): [T];
export default function useFetch<T>(path: string, defaultValue?: T) {
  const [data, _] = useState<T | undefined>(defaultValue);

  useEffect(() => {
    console.log(path);
    //fetch needed;
  }, []);

  return [data];
}
