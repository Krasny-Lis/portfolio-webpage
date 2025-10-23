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

  it('supports keyboard interaction with the navigation drawer', () => {
    cy.viewport(400, 800);
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('portfolio-language', 'en');
      },
    });

    cy.get('.navbar__toggle').as('toggle');
    cy.get('@toggle').focus().click();

    cy.get('#primary-menu')
      .should('have.class', 'open')
      .and('have.attr', 'role', 'dialog')
      .and('have.attr', 'aria-modal', 'true');

    cy.focused()
      .should('have.prop', 'tagName', 'A')
      .and('have.attr', 'data-cy', 'navbar-link-about');

    cy.focused().should('have.prop', 'tagName', 'A');

    cy.focused().type('{esc}');

    cy.get('#primary-menu').should('not.have.class', 'open');
    cy.focused().should('have.class', 'navbar__toggle');
  });
});
