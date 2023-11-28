import { useCallback } from 'react';

import useKey from 'react-use/lib/useKey';


export interface UsePressEscParams {
  isEnabled?: boolean;
  targetRef?: React.RefObject<HTMLElement>;
  onPress: () => void;
}

export function usePressEsc({
  isEnabled = true,
  targetRef,
  onPress,
}: UsePressEscParams): void {
  const handler = useCallback((e: KeyboardEvent) => {
    if (!isEnabled) {
      return;
    }

    if (!targetRef?.current) {
      onPress();
      return;
    }

    if (document.activeElement === targetRef.current) {
      e.stopImmediatePropagation();
      onPress();
    }
  }, [targetRef, isEnabled, onPress]);

  return useKey('Escape', handler, {}, [isEnabled]);
}
