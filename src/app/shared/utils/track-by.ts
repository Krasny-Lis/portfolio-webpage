export const trackById = <T extends { id: string | number }>(
  _index: number,
  item: T,
): string | number => item.id;

export const trackByLabel = <T extends { label: string } | string>(
  _index: number,
  item: T,
): string => (typeof item === 'string' ? item : item.label);
