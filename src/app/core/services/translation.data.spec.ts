import { TRANSLATIONS } from './translation.data';

describe('Home technology labels', () => {
  it.each(['en', 'pl'] as const)('does not advertise React in %s', (language) => {
    expect(TRANSLATIONS[language].home.tags).toEqual([
      'Angular 19',
      'SSR',
      'NgRx',
      'Signals',
    ]);
  });
});
