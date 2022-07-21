import { useState } from 'react';
import { useDebounce } from 'react-use';

interface PropsType {
  milliseconds: number;
}

export default function useValueDebounce<T>({
  milliseconds = 1000,
}: PropsType) {
  const [value, setValue] = useState<T>();
  const [debounceValue, setDebounceValue] = useState<T>();
  useDebounce(
    () => {
      setDebounceValue(value);
    },
    milliseconds,
    [value]
  );
  return [debounceValue, setValue] as const;
}
