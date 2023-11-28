import { useMemo } from 'react';

import type { GridList } from '../types';


export const useTotalItemCount = <D ,>(items: GridList<D>) => {
  return useMemo(() => {
    let sum = 0;

    for (let i = 0; i < items.length; i++) {
      const { rows, columns } = items[i];
      sum += rows * columns;
    }

    return sum;
  }, [items.length]);
};
