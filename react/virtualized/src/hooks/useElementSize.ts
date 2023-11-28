import { useState, useEffect, Dispatch } from 'react';


interface ElementSize {
    width: number;
    height: number;
}

export const useElementSize = (): [ElementSize, Dispatch<HTMLDivElement | null>] => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [size, setSize] = useState<ElementSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!ref) {
      return undefined;
    }

    const handleSize = () => {
      setSize({
        width: ref?.offsetWidth || 0,
        height: ref?.offsetHeight || 0,
      });
    };

    window.addEventListener('resize', handleSize);

    handleSize();

    return () => window.removeEventListener('resize', handleSize);
  }, [ref]);

  return [size, setRef];
};
