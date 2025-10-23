describe('Language selection', () => {
  it('persists the selected language across reloads', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('portfolio-language', 'en');
        win.localStorage.setItem('portfolio-theme', 'light');
      },
    });

    cy.get('[data-cy="navbar-language-pl"]').click();

    cy.window().then((win) => {
      expect(win.localStorage.getItem('portfolio-language')).to.eq('pl');
    });

    cy.reload();

    cy.get('[data-cy="navbar-language-pl"]').should('have.attr', 'aria-pressed', 'true');
    cy.get('[data-cy="navbar-link-contact"]').should('contain.text', 'Kontakt');
  });
});
