import { ReactNode } from 'react';


export type RenderCell<D> = ({ item, areCellsSingle }
                              : {item: GridItem<D>, areCellsSingle: boolean}) => ReactNode

export interface GridProps<D> {
    items: GridList<D>;
    className?: string;
    threshold?: number;
    cellBaseHeight: number;
    cellBaseWidth?: string;
    loadMore?: LoadMoreCallback;
    renderCell: RenderCell<D>;
    gap: number;
    loaderChildren?: ReactNode;
    buffer?: number;
    cellsSingleBreakpoint?: number;
}

export interface WrapperCellProps<D> {
    item: GridItem<D>;
    gap: number;
    areCellsSingle: boolean;
    renderCell: RenderCell<D>;
}

export type GridItem<D> = {
  id: string | number;
  rows: number;
  columns: number;
  data: D;
}

export type GridList<D> = GridItem<D>[]

export type LoadMoreCallback = () => unknown | void | never
