import { useState, useEffect, useRef } from "react";

// fully implemented
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delayMs]);

  return debouncedValue;
}
