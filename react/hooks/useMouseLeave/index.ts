import { useEffect, RefObject } from 'react';


export interface UseMouseLeaveParams {
  hoverableRefs: RefObject<HTMLElement>[];
  isEnabled?: boolean;
  onLeave: () => void,
}

export function useMouseLeave({
  isEnabled = true,
  hoverableRefs = [],
  onLeave,
}: UseMouseLeaveParams): void {
  useEffect(() => {
    if (!isEnabled) {
      return undefined;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (
        !hoverableRefs.some((ref) => ref.current?.contains((e.target as Node))) &&
        document.hasFocus()
      ) {
        onLeave();
      }
    };

    window.addEventListener('mouseover', handleMouseMove);

    return () => {
      window.removeEventListener('mouseover', handleMouseMove);
    };
  }, [onLeave, hoverableRefs, isEnabled]);
}
