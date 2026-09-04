import { AVAILABLE_TAGS, normalizeTagLabel } from './tag-utils';

describe('normalizeTagLabel', () => {
  it('should return canonical label when available', () => {
    expect(normalizeTagLabel('angular')).toBe('Angular');
    expect(normalizeTagLabel('mAtErIaL')).toBe('Material');
  });

  it('should return null for unsupported tags', () => {
    expect(normalizeTagLabel('unknown')).toBeNull();
  });

  it('should ignore obsolete React filters in bookmarked URLs', () => {
    expect(normalizeTagLabel('react')).toBeNull();
    expect(normalizeTagLabel('ReAcT')).toBeNull();
  });

  it('should offer only the remaining project filters', () => {
    expect(AVAILABLE_TAGS).toEqual(['Angular', 'Material']);
  });
});
