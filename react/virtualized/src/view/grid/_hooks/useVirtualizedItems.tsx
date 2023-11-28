import debounce from 'lodash/debounce';
import { nanoid } from 'nanoid';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import type { GridList } from '../types';


interface UseVirtualizedItemsProps<T> {
  ref: React.RefObject<HTMLDivElement>;
  items: GridList<T>;
  itemHeight: number;
  buffer: number;
  columnsInGrid: number;
  areCellsSingle: boolean;
}

type UseVirtualizedItems<T> = {
  itemsToRender: GridList<T>;
  correctiveItems: JSX.Element[];
  offsetY: number;
};


export const useVirtualizedItems = <T,>(props: UseVirtualizedItemsProps<T>)
  : UseVirtualizedItems<T> => {
  const {
    ref,
    items,
    itemHeight,
    buffer ,
    columnsInGrid ,
    areCellsSingle,
  } = props;
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);

  const gridRef = ref.current;

  const updateIndices = useCallback(() => {
    if (!gridRef) {
      return;
    }

    const { scrollTop } = gridRef;

    const start = Math.max((Math.floor(scrollTop / itemHeight) - buffer) * columnsInGrid, 0);
    const visibleItems = Math.ceil(gridRef.clientHeight / itemHeight) * columnsInGrid;
    const end = Math.min(start + visibleItems + (2 * buffer * columnsInGrid), items.length);

    setStartIndex(start);
    setEndIndex(end);
  }, [itemHeight, buffer, columnsInGrid, items.length]);

  const debouncedUpdateIndices = useMemo(
    () => debounce(() => {
      updateIndices();
    }, 100),
    [updateIndices],
  );

  useEffect(() => {
    updateIndices();
  }, [items, updateIndices]);

  useEffect(() => {
    if (!gridRef) {
      return undefined;
    }

    const onScroll = () => {
      debouncedUpdateIndices();
    };

    gridRef.addEventListener('scroll', onScroll);

    return () => {
      gridRef.removeEventListener('scroll', onScroll);
    };
  }, [debouncedUpdateIndices]);

  const offsetY = useMemo(
    () => startIndex / columnsInGrid * itemHeight,
    [startIndex, columnsInGrid, itemHeight],
  );

  const itemsToRender = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex],
  );

  const correctiveItems = useMemo(
    () => {
      if (areCellsSingle) {
        return [];
      }

      const result = [];

      for (let i = 0; i < startIndex; i++) {
        const item = items[i];

        if (item.rows === 1 && item.columns === 1) {
          continue;
        }

        for (let j = 0; j < (item.rows * item.columns) - 1; j++) {
          result.push(<div key={nanoid()} />);
        }
      }

      return result;
    },
    [items, startIndex, areCellsSingle],
  );

  return {
    itemsToRender,
    correctiveItems,
    offsetY,
  };
};
