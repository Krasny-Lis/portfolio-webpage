import { trackById, trackByLabel } from './track-by';

describe('trackBy helpers', () => {
  it('should return the id for items with an id property', () => {
    const item = { id: 'abc123', value: 42 };

    expect(trackById(0, item)).toBe('abc123');
  });

  it('should return the label for items with a label property', () => {
    const item = { label: 'Angular', url: 'https://angular.dev' };

    expect(trackByLabel(0, item)).toBe('Angular');
  });

  it('should return the string item when tracking primitive labels', () => {
    expect(trackByLabel(0, 'Signals')).toBe('Signals');
  });
});
