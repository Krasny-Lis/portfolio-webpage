describe('Portfolio smoke', () => {
  it('navigates through main routes', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('portfolio-language', 'en');
      },
    });

    cy.get('[data-cy="home-cta-projects"]').click();
    cy.url().should('include', '/projects');
    cy.get('[data-cy="navbar-link-contact"]').click();
    cy.url().should('include', '/contact');
  });
});
