import throttle from 'lodash/throttle';
import { useEffect, useRef } from 'react';

import { LoadMoreCallback } from '../view/grid';


interface UseInfiniteScrollProps {
  ref: React.RefObject<HTMLDivElement>;
  loadMore?: LoadMoreCallback;
  threshold?: number
}

export const useInfiniteScroll = ({ ref, loadMore, threshold = 100 }: UseInfiniteScrollProps) => {
  // const [isLoading, setIsLoading] = useState(false);
  const isLoading = useRef(false);
  const { current: element } = ref;

  useEffect(() => {
    if (!element || !loadMore) {
      return undefined;
    }

    const onScroll = throttle(async () => {
      if (isLoading.current) {
        return;
      }

      const { offsetHeight, scrollTop, scrollHeight } = element;

      if (offsetHeight + scrollTop + threshold >= scrollHeight) {
        isLoading.current = true;

        try {
          await loadMore();
        } finally {
          isLoading.current = false;
        }
      }
    },750);

    element.addEventListener('scroll', onScroll);

    return () => {
      onScroll.cancel();
      element.removeEventListener('scroll', onScroll);
    };
  }, [element, threshold, loadMore]);
};
