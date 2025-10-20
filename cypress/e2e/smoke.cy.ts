describe('Portfolio smoke', () => {
  it('navigates through main routes', () => {
    cy.visit('/');
    cy.contains('Zobacz projekty').click();
    cy.url().should('include', '/projects');
    cy.contains('Kontakt').click();
    cy.url().should('include', '/contact');
  });
});
