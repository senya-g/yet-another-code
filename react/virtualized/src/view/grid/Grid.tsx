import classNames from 'classnames';
import React, {
  ReactElement,
  useMemo,
  useRef,
  memo
} from 'react';

import WrapperCell from './_components/WrapperCell';
import { useTotalItemCount, useVirtualizedItems, useColumnsInGrid } from './_hooks';
import type { GridItem, GridProps } from './types';
import { useInfiniteScroll } from '../../hooks';


import styles from './Grid.module.scss';


const Grid = <C,>(props: GridProps<C>) => {
  const {
    items,
    loadMore,
    cellBaseHeight,
    cellBaseWidth = 'repeat(auto-fill, minmax(152px, 1fr))',
    threshold,
    className,
    renderCell,
    loaderChildren = undefined,
    gap,
    buffer = 5,
    cellsSingleBreakpoint = 3,
  } = props;
  console.log('Grid component');

  const ref = useRef(null);
  // const cachedComponents= useRef<{ [key: string]: ReactNode }>({});
  const totalItemCount = useTotalItemCount<C>(items);
  const { columnsInGrid, setRefForGrid } = useColumnsInGrid();

  const itemHeight = useMemo(
    () => cellBaseHeight + gap,
    [cellBaseHeight, gap],
  );
  const areCellsSingle = useMemo(
    () => columnsInGrid <= cellsSingleBreakpoint,
    [columnsInGrid, cellsSingleBreakpoint],
  );
  const totalVirtualHeight = useMemo(
    () => Math.ceil(totalItemCount / columnsInGrid) * itemHeight,
    [totalItemCount, columnsInGrid, itemHeight],
  );

  const { itemsToRender, correctiveItems, offsetY } = useVirtualizedItems({
    ref,
    items,
    itemHeight,
    buffer,
    columnsInGrid,
    areCellsSingle,
  });

  useInfiniteScroll({ ref, loadMore, threshold });

  // const renderItems = useMemo(() => {
  //   return itemsToRender.map((item: GridItem<C>) => {
  //     if (!cachedComponents.current[item.id]) {
  //       cachedComponents.current[item.id] = (
  //         <WrapperCell
  //           key={item.id}
  //           areCellsSingle={areCellsSingle}
  //           gap={gap}
  //           item={item}
  //           renderCell={renderCell}
  //         />
  //       );
  //     }
  //
  //     return cachedComponents.current[item.id];
  //   });
  // }, [itemsToRender]);

  return (
    <div
      ref={ref}
      className={classNames(styles.container, className)}
    >
      <div
        className={styles.wrapperClassName}
        style={{
          height: totalVirtualHeight,
          position: 'relative',
          marginTop: -gap,
        }}
      >
        <div
          ref={setRefForGrid}
          className={styles.grid}
          style={{
            transform: `translateY(${offsetY}px)`,
            columnGap: `${gap}px`,
            gridAutoRows: `${itemHeight}px`,
            gridTemplateColumns: cellBaseWidth,
          }}
        >
          { correctiveItems.map((blank: JSX.Element) => blank) }
          {/*{ renderItems }*/}
          { itemsToRender.map((item: GridItem<C>) => (
            <WrapperCell
              key={item.id}
              areCellsSingle={areCellsSingle}
              gap={gap}
              item={item}
              renderCell={renderCell}
            />
          ))}
        </div>
      </div>
      { loaderChildren }
    </div>
  );
};

export default memo(Grid) as <C>(props: GridProps<C>) => ReactElement;
