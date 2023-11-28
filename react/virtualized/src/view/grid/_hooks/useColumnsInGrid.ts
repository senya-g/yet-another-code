import { useState, useEffect, Dispatch } from 'react';


interface UseColumnsInGrid {
  columnsInGrid:number,
  rowsInGrid: number,
  setRefForGrid: Dispatch<HTMLDivElement | null>
}

export const useColumnsInGrid = () : UseColumnsInGrid => {
  const [ref, setRefForGrid] = useState<HTMLDivElement | null>(null);
  const [columnsInGrid, getColumnsInGrid] = useState<number>(3);
  const [rowsInGrid, getRowsInGrid] = useState<number>(1);

  useEffect(() => {
    if (!ref) {
      return undefined;
    }

    const handleSize = () => {
      const columnsLength = window.getComputedStyle(ref).getPropertyValue('grid-template-columns').split(' ').length;
      const rowsLength = window.getComputedStyle(ref).getPropertyValue('grid-template-rows').split(' ').length;

      getColumnsInGrid(columnsLength);
      getRowsInGrid(rowsLength);
    };

    window.addEventListener('resize', handleSize);

    handleSize();

    return () => window.removeEventListener('resize', handleSize);
  }, [ref]);

  return { columnsInGrid, rowsInGrid, setRefForGrid };
};
