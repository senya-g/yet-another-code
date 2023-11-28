import classNames from 'classnames';
import React, { memo } from 'react';

import type { WrapperCellProps } from '../types';

import styles from '../Grid.module.scss';


const WrapperCell =<D,> ({
  item, gap, areCellsSingle, renderCell,
}: WrapperCellProps<D>) => {
  console.log('WrapperCell');
  const isResponsive = item.rows > 1 || item.columns > 1;
  const Component = renderCell({ item, areCellsSingle });
  const style = isResponsive
    ? {
        gridRow: areCellsSingle ? 'auto' : `span ${item.rows}`,
        gridColumn: areCellsSingle ? 'auto' : `span ${item.columns}`,
      }
    : '';

  return (
    <div
      className={classNames(styles.grid__item)}
      style={{ ...style, paddingTop: gap }}
    >
      { Component }
    </div>
  );
};

export default memo(WrapperCell) as <C>(props: WrapperCellProps<C>) => JSX.Element;
