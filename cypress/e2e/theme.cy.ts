describe('Theme switching', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('portfolio-language', 'en');
        win.localStorage.setItem('portfolio-theme', 'light');
      },
    });
  });

  it('toggles between light and dark modes and persists the selection', () => {
    cy.get('body').should('have.class', 'theme-light').and('not.have.class', 'theme-dark');

    cy.get('[data-cy="navbar-theme-toggle"]').click();

    cy.get('body').should('have.class', 'theme-dark').and('not.have.class', 'theme-light');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('portfolio-theme')).to.eq('dark');
    });

    cy.reload();

    cy.get('body').should('have.class', 'theme-dark');
  });
});
