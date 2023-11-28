import { GridItem, GridList } from '../view/grid';


export function mixBundleWithBanner<M, R
  >(bundle: GridList<M>, banners: { [key: number]: GridItem<R> }, startIndex: number )
  : GridList<M | R> {
  let data: GridList<M | R> = [];

  for (let i = 0; i < bundle.length; i++) {
    const currentIndex = startIndex + i;

    if (banners[currentIndex]) {
      data = [...data, banners[currentIndex], bundle[i]];
    } else {
      data = [...data, bundle[i]];
    }
  }

  return data;
}
