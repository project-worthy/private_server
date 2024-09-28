import { useEffect, useRef } from "react";

export default function useDidMount<T extends object | null>(
  fn: () => void,
  initalValue: T,
) {
  const ref = useRef<T>(initalValue);

  useEffect(() => {
    fn();
  });

  return [ref];
}
