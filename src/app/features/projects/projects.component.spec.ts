import { AVAILABLE_TAGS, normalizeTagLabel } from './tag-utils';

describe('normalizeTagLabel', () => {
  it('should return canonical label when available', () => {
    expect(normalizeTagLabel('angular')).toBe('Angular');
    expect(normalizeTagLabel('mAtErIaL')).toBe('Material');
    expect(normalizeTagLabel('sql server')).toBe('SQL Server');
    expect(normalizeTagLabel('sSiS')).toBe('SSIS');
    expect(normalizeTagLabel('ssrs')).toBe('SSRS');
    expect(normalizeTagLabel('python')).toBe('Python');
  });

  it('should return null for unsupported tags', () => {
    expect(normalizeTagLabel('unknown')).toBeNull();
  });

  it('should ignore obsolete React filters in bookmarked URLs', () => {
    expect(normalizeTagLabel('react')).toBeNull();
    expect(normalizeTagLabel('ReAcT')).toBeNull();
  });

  it('should offer the available project filters', () => {
    expect(AVAILABLE_TAGS).toEqual([
      'Angular',
      'Material',
      'SQL Server',
      'SSIS',
      'SSRS',
      'Python',
    ]);
  });
});
