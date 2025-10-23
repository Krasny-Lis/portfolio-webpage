export const trackByLabel = <T extends { label: string } | string>(
  _index: number,
  item: T,
): string => (typeof item === 'string' ? item : item.label);
