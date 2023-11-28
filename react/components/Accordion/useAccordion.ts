import { useMemo, useState, useCallback } from 'react';

export interface UseAccordionParams {
  expandMode?: 'single' | 'multiple';
}

export interface AccordionState {
  isExpanded: (id: string) => boolean;
  onToggle: (id: string) => void;
  updateExpanded: (items: string[]) => void;
}

export function useAccordion(params: UseAccordionParams): AccordionState {
  const [expandedItems, setExpandedItems] = useState<string[]>(['1']);

  const handleIsExpanded = useCallback((id: string) => expandedItems.includes(id), [expandedItems]);

  const handleToggle = useCallback((id: string) => {
    switch (params.expandMode) {
      case 'single':
        setExpandedItems(
          expandedItems.includes(id)
            ? []
            : [id],
        );
        return;
      case 'multiple':
        setExpandedItems(
          expandedItems.includes(id)
            ? expandedItems.filter((it) => it !== id)
            : expandedItems.concat(id),
        );
        return;
      default:
        throw new Error(`Unknown expandMode '${params.expandMode}'`);
    }
  }, [expandedItems, params.expandMode]);

  return useMemo(() => {
    return {
      isExpanded: handleIsExpanded,
      onToggle: handleToggle,
      updateExpanded: setExpandedItems,
    };
  }, [handleIsExpanded, handleToggle]);
}
