import { normalizeTagLabel } from './tag-utils';

describe('normalizeTagLabel', () => {
  it('should return canonical label when available', () => {
    expect(normalizeTagLabel('angular')).toBe('Angular');
    expect(normalizeTagLabel('ReAcT')).toBe('React');
  });

  it('should return null for unsupported tags', () => {
    expect(normalizeTagLabel('unknown')).toBeNull();
  });
});
