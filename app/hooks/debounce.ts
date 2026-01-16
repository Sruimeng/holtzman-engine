import type { DebouncedFunc } from 'lodash-es';
import { debounce, throttle } from 'lodash-es';
import { useMemo } from 'react';

export const useDebounce = <T extends (...p: any) => any>(
  fn: T,
  deps: React.DependencyList = [],
): DebouncedFunc<T> => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFn = useMemo(() => debounce(fn, 200), deps);
  return debouncedFn;
};

export const useThrottle = <T extends (...p: any) => any>(
  fn: T,
  deps: React.DependencyList = [],
): DebouncedFunc<T> => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledFn = useMemo(() => throttle(fn, 100), deps);
  return throttledFn;
};
